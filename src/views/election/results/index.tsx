import { Bar } from '@ant-design/charts'
import { BarConfig } from '@ant-design/charts/es/bar'
import { PlayCircleFilled } from '@ant-design/icons'
import { Space, Statistic } from 'antd'
import Title from 'antd/lib/typography/Title'
import { ElectionParams } from 'components/queue/ElectionParams'
import IconButton from 'containers/button/IconButton'
import { BackendAPI } from 'core/api'
import { AuthorizationError } from 'core/errors/AuthorizationError'
import { fetchElectionStats } from 'core/helpers/fetchElectionStats'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { IElectionEntity } from 'core/models/election/IElectionEntity'
import { electionBallotReducer } from 'core/reducers/electionBallotsReducer'
import { ElectionService } from 'core/service/election/ElectionService'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import * as React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
/**
 * Help for scaling found here
 * https://stackoverflow.com/questions/18191893/generate-pdf-from-html-in-div-using-javascript
 *
 * View for election results, will fetch election based on the ID in the url
 */
export default function ElectionResultView(): React.ReactElement {
    const electionService = new ElectionService(BackendAPI)
    const routeParams = useParams<ElectionParams>()
    const [t] = useTranslation(['common', 'election', 'error'])

    const [election, setElection] = useState<IElectionEntity | undefined>()
    const [error, setError] = useState('')
    const [ballotState, setBallotState] = React.useReducer(electionBallotReducer, {
        ballotWithStats: [],
        activeBallotIndex: 0,
    })

    const fetchElection = async (electionId: string) => {
        try {
            return await electionService.getElection(Number.parseInt(electionId))
        } catch (error) {
            if (error instanceof AuthorizationError) {
                setError(t('error:You are not authorized'))
            } else {
                setError(t('error:Election do not exist'))
            }
        }
    }
    React.useEffect(() => {
        async function getResultData(electionId: string) {
            const election = await fetchElection(electionId)
            const stats = await fetchElectionStats(Number.parseInt(electionId))
            if (election && stats) {
                setElection(election)
                const ballots = election.ballots
                    ? election.ballots.map((ballot) => ({ ...ballot } as IBallotEntity))
                    : new Array<IBallotEntity>()
                setBallotState({ type: 'addBallots', payload: ballots })
                setBallotState({ type: 'addStats', payload: stats })
            }
        }
        const electionId = routeParams.electionId
        if (electionId) getResultData(electionId)
    }, [])

    const ballotResults: Array<React.ReactElement> = []
    function createDiagrams() {
        let config: BarConfig = {
            data: [],
            xField: 'votes',
            yField: 'candidate',
            seriesField: 'candidate',
            barStyle: {
                y: 200,
            },
            yAxis: {
                label: null,
            },
            xAxis: { tickInterval: 5 },
            label: {
                position: 'middle',
            },
        }
        for (const ballot of ballotState.ballotWithStats) {
            const stats = ballot
                .getVoteStatsWithCandidates()
                .candidates.map((c, i) => {
                    c.candidate = `# ${i + 1} ${c.candidate}`
                    return c
                }) // Sorts ballots in decreasing order
                .sort((statsA, statsB) => {
                    return statsB.votes - statsA.votes
                })

            config = { ...config, data: stats }
            const votes = ballot.votes
            ballotResults.push(
                <>
                    <div className="result-item mb-20">
                        <Title level={3}>{ballot.title}</Title>
                        <Space direction="horizontal" size="large">
                            <Statistic title={t('common:Total')} value={votes.total} />
                            <Statistic title={t('common:Votes')} value={votes.votes} />
                            <Statistic title={t('common:Blank')} value={votes.blank} />
                        </Space>
                        <Bar key={Math.random()} {...config}></Bar>
                    </div>
                </>,
            )
        }
    }

    function getFileName() {
        if (!election) return
        return `results-${election.title}`.toLowerCase()
    }

    createDiagrams()

    async function createPDF() {
        const padding = 25
        const resultElement = document.body.querySelector('#results') as HTMLElement
        if (resultElement) {
            // Creates canvas element from HTML
            const canvas = await html2canvas(resultElement)
            // PDF generator, height is equal to canvas height to create one large page
            const pdf = new jsPDF('portrait', 'pt', [850, canvas.height])
            // Convert canvas to data URL with maximum quality
            const imgData = canvas.toDataURL('image/jpeg', 1)

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const imageWidth = canvas.width
            const imageHeight = canvas.height

            // Create rato factor for scaling the image on the PDF page
            const ratio =
                imageWidth / imageHeight >= pageWidth / pageHeight ? pageWidth / imageWidth : pageHeight / imageHeight

            pdf.addImage(
                imgData,
                'JPEG',
                padding,
                padding,
                imageWidth * ratio - padding * 2,
                imageHeight * ratio - padding * 2,
            )
            return pdf.save(getFileName())
        }
    }
    return (
        <>
            <Title level={1}>{t('election:Results')}</Title>
            {election && (
                <>
                    <Space direction="horizontal" className="mb-15">
                        <IconButton
                            icon={<PlayCircleFilled />}
                            text={t('common:Download pdf')}
                            onClick={createPDF}
                            color="green"
                        />
                    </Space>
                    <div id="results" style={{}}>
                        <Title level={2}>{election.title}</Title>
                        <p>{election.description}</p>
                        {ballotResults}
                    </div>
                </>
            )}
            {!election && <p>{error}</p>}
        </>
    )
}

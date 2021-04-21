import { Bar, Line } from '@ant-design/charts'
import { Progress } from 'antd'
import { BackendAPI } from 'core/api'
import { fetchElectionStats } from 'core/helpers/fetchElectionStats'
import { IBallotEntity } from 'core/models/ballot/IBallotEntity'
import { electionBallotReducer } from 'core/reducers/electionBallotsReducer'
import { ElectionService } from 'core/service/election/ElectionService'
import { jsPDF } from 'jspdf'
import PDFObject from 'pdfobject'
import html2canvas from 'html2canvas'
import html2PDF from 'jspdf-html2canvas'
import * as React from 'react'
import { useLocation } from 'react-router-dom'
/**
 * The main view used for creating an election
 */
export default function ElectionResultView(): React.ReactElement {
    const r = useLocation().hash
    const electionService = new ElectionService(BackendAPI)
    console.log(r)

    const [ballotState, setBallotState] = React.useReducer(electionBallotReducer, {
        ballots: [],
        activeBallotIndex: 0,
    })
    const fetchElection = async (electionId: string) => {
        try {
            return await electionService.getElection(Number.parseInt(electionId))
        } catch (error) {
            /**hi */
        }
    }
    React.useEffect(() => {
        async function start() {
            const election = await fetchElection('3')
            if (election) {
                const stats = await fetchElectionStats(3)
                setBallotState({ type: 'addStats', payload: stats })

                const ballots = election.ballots
                    ? election.ballots.map((ballot) => ({ ...ballot } as IBallotEntity))
                    : new Array<IBallotEntity>()
                setBallotState({ type: 'addBallots', payload: ballots })
            }
            test()
        }
        start()
    }, [])
    let diagramStats: Array<any>
    for (const ballot of ballotState.ballots) {
        diagramStats = ballot.stats.stats.candidates
            .map((stat, index) => {
                return { ...stat, candidate: ballot.ballot.candidates[index].candidate }
            })
            // Sorts ballots in decreasing order
            .sort((statsA, statsB) => {
                return statsB.votes - statsA.votes
            })
    }
    const A4_width = 595 //pixels
    const A4_height = 842 //pixels
    const ratio = 1.5 // scale for higher image's dpi
    console.log('starting...')
    async function test() {
        async function createPDF() {
            console.log('creating pdf')
            const resultElement = document.body.querySelector('#results') as HTMLElement
            let k
            if (resultElement) {
                k = await html2PDF(resultElement, {
                    jsPDF: {
                        orientation: 'portrait',
                        units: 'mm',
                        format: 'a4',
                    },
                    html2canvas: {
                        width: A4_width * ratio,
                        height: A4_height * ratio,
                        scrollX: 0,
                        scale: 3,
                        scrollY: -window.scrollY,
                    },
                    imageType: 'image/jpeg',
                    imageQuality: 1,
                    output: '.',
                    success: function () {
                        console.log('hei')
                    },
                })
            }
            return k.output('datauristring')
        }
        PDFObject.embed(await createPDF(), '#example1')
    }
    const k = [1, 2, 3]
    const data = [
        { year: '1991', value1: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ]

    const config = {
        data,
        xField: 'year',
        yField: 'value',
        point: {
            size: 5,
            shape: 'diamond',
        },
        label: {
            style: {
                fill: '#aaa',
            },
        },
    }
    const kwi = k.map((e) => {
        return <div key={e}>{e}</div>
    })
    return (
        <>
            <div id="results" style={{}}>
                <Line {...config}></Line>
                <Bar {...config}></Bar>
                {kwi}
            </div>
            <div style={{ height: '900px', width: '1000px' }} id="example1"></div>
        </>
    )
}

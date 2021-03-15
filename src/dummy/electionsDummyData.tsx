import { BallotResultDisplay } from 'core/models/ballot/BallotResultDisplay'
import { BallotType } from 'core/models/ballot/BallotType'
import { ElectionStatus } from 'core/models/ElectionStatus'
import { IElection } from 'core/models/IElection'

export const elections: IElection[] = [
    {
        id: 1,
        electionOrganizer: 1,
        description: 'Very nice voting',
        title: 'My election',
        isAutomatic: false,
        status: ElectionStatus.NotStarted,
        isLocked: false,
        password: 'get it done',
        ballots: {
            title: 'Who is best in react',
            displayResultCount: true,
            order: 1,
            type: BallotType.SINGLE,
            candidates: [{ candidate: 'Steffen' }, { candidate: 'Mark' }],
            resultDisplayType: BallotResultDisplay.SINGLE,
            resultDisplayTypeCount: 1,
        },
        //openDate: moment().format(),
        // todo #125 antd uses moment so we should change our frontend dates to moment dates for ease of use
    },
]

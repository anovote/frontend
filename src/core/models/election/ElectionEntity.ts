import { IBallot } from '../ballot/IBallot'
import { IEligibleVoter } from '../ballot/IEligibleVoter'
import { ElectionStatus } from './ElectionStatus'
import { IElectionEntity } from './IElectionEntity'

/**
 * Represents a election entity.
 */
export class ElectionEntity implements IElectionEntity {
    private _election: IElectionEntity

    constructor(electionEntity: IElectionEntity) {
        this._election = electionEntity

        // create Date object for both dates
        if (electionEntity.openDate) {
            this._election.openDate = new Date(electionEntity.openDate)
        }
        if (electionEntity.closeDate) {
            this._election.closeDate = new Date(electionEntity.closeDate)
        }
    }
    get id(): number {
        return this._election.id
    }

    get title(): string {
        return this._election.title
    }

    get description(): string | undefined {
        return this._election.description
    }

    get status(): ElectionStatus {
        return this._election.status
    }

    get electionOrganizer(): number {
        return this._election.electionOrganizer
    }

    get isAutomatic(): boolean {
        return this._election.isAutomatic
    }

    get isLocked(): boolean {
        return this._election.isLocked
    }

    get eligibleVoters(): Array<IEligibleVoter> | undefined {
        return this._election.eligibleVoters
    }

    get password(): string | undefined {
        return this._election.password
    }

    get openDate(): Date | undefined {
        return this._election.openDate
    }

    get closeDate(): Date | undefined {
        return this._election.closeDate
    }

    get ballots(): Array<IBallot> | undefined {
        return this._election.ballots
    }

    get createdAt(): Date {
        return this._election.createdAt
    }

    get updatedAt(): Date {
        return this._election.updatedAt
    }
}

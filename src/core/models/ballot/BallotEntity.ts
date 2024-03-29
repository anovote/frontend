import { BallotResultDisplay } from './BallotResultDisplay'
import { BallotStatus } from './BallotStatus'
import { BallotType } from './BallotType'
import { IBallotEntity } from './IBallotEntity'
import { ICandidateEntity } from './ICandidate'

/**
 * Represents a ballot entity.
 */
export class BallotEntity implements IBallotEntity {
    private _ballot: IBallotEntity

    constructor(ballotEntity: IBallotEntity) {
        this._ballot = ballotEntity
    }

    /**
     * Updates the ballot values for this entity
     * @param updatedBallot updated ballot to assign
     */
    update(updatedBallot: IBallotEntity): void {
        this._ballot = { ...this._ballot, ...updatedBallot }
    }

    get id(): number {
        return this._ballot.id
    }

    get title(): string {
        return this._ballot.title
    }

    get description(): string | undefined {
        return this._ballot.description
    }

    get image(): string | undefined {
        return this._ballot.image
    }

    get type(): BallotType {
        return this._ballot.type
    }

    get resultDisplayType(): BallotResultDisplay {
        return this._ballot.resultDisplayType
    }

    get resultDisplayTypeCount(): number {
        return this._ballot.resultDisplayTypeCount
    }

    get displayResultCount(): boolean {
        return this._ballot.displayResultCount
    }

    get status(): BallotStatus {
        return this._ballot.status
    }

    get candidates(): Array<ICandidateEntity> {
        return this._ballot.candidates
    }

    get createdAt(): Date {
        return this._ballot.createdAt
    }

    get updatedAt(): Date {
        return this._ballot.updatedAt
    }

    get order(): number {
        return this._ballot.order
    }
}

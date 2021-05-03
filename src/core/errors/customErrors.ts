export class PasswordDoesNotMatchError extends Error {
    constructor(message?: string) {
        super(message)
    }
}

export class PasswordIsNotValidError extends Error {
    constructor(message?: string) {
        super(message)
    }
}

export class InvalidEmail extends Error {
    constructor(message?: string) {
        super(message)
    }
}

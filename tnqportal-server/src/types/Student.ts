import jwt = require('jsonwebtoken');
import env = require('env-var');
import assert = require('assert');

/** Represents the name of a user. */
export interface IName {
    first: string;
    last: string;
    preferred?: string;
}

/** Represents the biographical info of a user. */
export interface IBio {
    hometown: string;
    quote: string;
}

/** Represents the academic info of a user. */
export interface IAcademic {
    major: string;
    major2: string;
    minor: string;
}

/** Represents the metadata of a user. */
export interface IMetadata {
    confirmed: boolean;
    editable: boolean;
    admin?: boolean;
}

/** Represents a student with an entry in the yearbook. */
export interface IStudent{
    email: string;
    name: IName;
    bio?: IBio;
    academic?: IAcademic;
    metadata?: IMetadata;
}

/**
 * Implements a student with an entry in the yearbook.
 *
 * Students have a non-empty first/last/preferred name, and email with the form 'kerberos@mit.edu'
 */
export class Student implements IStudent {
    email: string;
    name: IName;
    bio: IBio;
    academic: IAcademic;
    metadata: IMetadata;

    checkRep() {
        assert(this.email.match('^(.*)(@mit.edu)$'), 'valid MIT email required');
        assert(this.name.first.length > 0, 'non-empty first name required');
        assert(this.name.last.length > 0, 'non-empty last name required');
        assert(this.name.preferred && this.name.preferred.length > 0, 'non-empty preferred name required');
    }

    /**
     * Create a student with email and name.
     * @param  {string} email - Email address of the student
     * @param  {IName} name - Name of the student
     */
    constructor(student: IStudent) {
        this.email = student.email;
        this.name = { ...student.name };

        // check if preferred name exists, and generate one if necessary
        if (!this.name.preferred) {
            this.name.preferred = `${this.name.first} ${this.name.last}`;
        };

        // set default bio and deep copy from parameter if present
        this.bio = {hometown: "",
            quote: ""
        };

        if (student.bio) {
            Object.assign(this.bio, student.bio)
        }

        // set default academic info and deep copy from parameter if present
        this.academic = {
            major: "",
            major2: "",
            minor: ""
        };

        if (student.academic) {
            Object.assign(this.academic, student.academic)
        }

        // set default metadata info and deep copy from parameter if present
        this.metadata = {
            confirmed: false,
            editable: true,
            admin: false
        };

        if (student.metadata) {
            Object.assign(this.metadata, student.metadata)
        }

        this.checkRep();
    };

    /**
     * Returns the student in object form
     */
    toObject() : IStudent {
        this.checkRep();

        return {
            email: this.email,
            name: this.name,
            bio: this.bio,
            academic: this.academic,
            metadata: this.metadata
        }
    }

    /**
     * Returns a signed JWT for this student suitable for authentication.
     *
     * The body of the JWT contains the email and admin flag of the student. The issuer,
     * expiration, and signing key are also included and specified as environment variables.
     */
    getJWT() {
        this.checkRep();

        const options = {
            expiresIn: env.get('JWT_TOKEN_EXP').asString(),
            issuer: env.get('JWT_TOKEN_ISS').asString(),
        }
        return jwt.sign({
            email: this.email,
            admin: this.metadata.admin
        }, env.get('JWT_TOKEN_KEY').required().asString(), options)
    }
}


/**
 * Tests for the Student class.
 * Testing methodology by partitions:
 *  constructor()
 *      has preferred name/doesn't have preferred name
 *      has bio/doesn't have bio
 *      has academic/doesn't have academic
 *      has metadata/doesn't have metadata
 *      has empty first name/has non-empty first name
 *      has empty last name/has non-empty last name
 *      has valid mit email/has invalid mit email/has no email
 *  toObject()
 *  getJWT()
 *      returns required body fields/does not return required body fields
 *      verified with token key/not verified with token key
 */

import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';
import env = require('env-var');
import jwt from 'jsonwebtoken';
import { Student, IName, IBio, IAcademic, IMetadata} from '../../src/types/Student';
import { AssertionError } from 'assert';



describe('Student', () => {
    it('handles preferred name', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe",
            preferred: "John Doe"
        };
        const result = new Student({
            email: "test@mit.edu",
            name
        });

        expect(result.email).is.equal("test@mit.edu")
        expect(result.name).to.deep.equal(name);
    });

    it('handles missing preferred name', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe"
        };
        const result = new Student({
            email: "test@mit.edu",
            name
        });
        expect(result.name.preferred).equal("Jonathan Doe");
    });

    it('handles existing bio info', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe",
            preferred: "John Doe"
        };
        const bio: IBio = {
            hometown: "Cambridge",
            quote: "An apple a day keeps the doctor away."
        }
        const result = new Student({
            email: "test@mit.edu",
            name,
            bio
        });

        expect(result.bio).to.deep.equal(bio);
    });

    it('handles existing academic info', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe",
            preferred: "John Doe"
        };
        const academic: IAcademic = {
            major: "6",
            major2: "18",
            minor: "CMS"
        }
        const result = new Student({
            email: "test@mit.edu",
            name,
            academic
        });

        expect(result.academic).to.deep.equal(academic);
    });

    it('handles existing metadata info', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe",
            preferred: "John Doe"
        };
        const metadata: IMetadata = {
            confirmed: true,
            editable: false,
            admin: true
        }
        const result = new Student({
            email: "test@mit.edu",
            name,
            metadata
        });

        expect(result.metadata).to.deep.equal(metadata);
    });

    it('handles metadata without admin field', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe",
            preferred: "John Doe"
        };
        const metadata: IMetadata = {
            confirmed: true,
            editable: false,
        }
        const result = new Student({
            email: "test@mit.edu",
            name,
            metadata
        });

        expect(result.metadata.admin).to.equal(false);
    });

    it('throws on empty first name', () => {
        const name: IName = {
            first: "",
            last: "Doe"
        };

        expect(() => {
            return new Student({
                email: "test@mit.edu",
                name
            });
        }).to.throw('non-empty first name required');
    });

    it('throws on empty last name', () => {
        const name: IName = {
            first: "John",
            last: ""
        };

        expect(() => {
            return new Student({
                email: "test@mit.edu",
                name
            });
        }).to.throw('non-empty last name required');
    });

    it('throws on invalid MIT email', () => {
        const name: IName = {
            first: "John",
            last: "Doe"
        };

        expect(() => {
            return new Student({
                email: "test@gmail.com",
                name
            });
        }).to.throw('valid MIT email required');
    });

    it('throws on missing email', () => {
        const name: IName = {
            first: "John",
            last: "Doe"
        };

        expect(() => {
            return new Student({
                email: "",
                name
            });
        }).to.throw('valid MIT email required');
    });

    it('correctly exports as an object', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe",
            preferred: "John Doe"
        };
        const bio: IBio = {
            hometown: "Cambridge",
            quote: "An apple a day keeps the doctor away."
        }
        const academic: IAcademic = {
            major: "6",
            major2: "18",
            minor: "CMS"
        }
        const metadata: IMetadata = {
            confirmed: true,
            editable: false,
            admin: true
        }
        const newStudent = new Student({
            email: "test@mit.edu",
            name,
            bio,
            academic,
            metadata
        });

        const result = newStudent.toObject();

        expect(result.email).to.deep.equal("test@mit.edu");
        expect(result.name).to.deep.equal(name);
        expect(result.bio).to.deep.equal(bio);
        expect(result.academic).to.deep.equal(academic);
        expect(result.metadata).to.deep.equal(metadata);
    });

    it('issues a JWT with email, admin, and valid issuer', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe"
        };
        const result = new Student({
            email: "test@mit.edu",
            name
        });

        const resultJWT = result.getJWT();
        const decodedJWT = jwt.decode(resultJWT);

        expect(decodedJWT).to.have.property("email", "test@mit.edu");
        expect(decodedJWT).to.have.property("admin", false);
        expect(decodedJWT).to.have.property("iss", "https://tnqportal.mit.edu");
    });

    it('issues a JWT that is signed by the token key', () => {
        const name: IName = {
            first: "Jonathan",
            last: "Doe"
        };
        const result = new Student({
            email: "test@mit.edu",
            name
        });

        const resultJWT = result.getJWT();
        expect(() => {
            jwt.verify(resultJWT, env.get('JWT_TOKEN_KEY').required().asString())
        }).to.not.throw('invalid signature');
    });
});
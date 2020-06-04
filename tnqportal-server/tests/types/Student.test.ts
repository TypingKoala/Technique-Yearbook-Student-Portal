/**
 * Tests for the Student class.
 * Testing methodology by partitions:
 *  constructor()
 *      has preferred name/doesn't have preferred name
 *      has bio/doesn't have bio
 *      has academic/doesn't have academic
 *      has metadata/doesn't have metadata
 *  toObject()
 */

import { expect } from 'chai';
import { Student, IName, IBio, IAcademic, IMetadata} from '../../src/types/Student';

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
            editable: false
        }
        const result = new Student({
            email: "test@mit.edu",
            name,
            metadata
        });

        expect(result.metadata).to.deep.equal(metadata);
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
            editable: false
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
    })
});
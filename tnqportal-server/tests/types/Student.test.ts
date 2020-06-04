/**
 * Tests for the Student class.
 * Testing methodology by partitions:
 *  constructor()
 *      has preferred name/doesn't have preferred name
 *      has bio/doesn't have bio
 *      has academic/doesn't have academic
 *      has metadata/doesn't have metadata
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
        expect(result.name).is.equal(name);
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

        expect(result.bio).is.equal(bio);
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

        expect(result.academic).is.equal(academic);
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

        expect(result.metadata).is.equal(metadata);
    });
});
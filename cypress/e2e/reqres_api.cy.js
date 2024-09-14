describe('ReqRes API Tests', () => {

    const baseUrl = 'https://reqres.in/api';

    // 1. List Users
    it('should retrieve a list of users', () => {
        cy.request('GET', `${baseUrl}/users`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('data');
        });
    });

    // 2. Single User
    it('should retrieve a single user by ID', () => {
        const userId = 2; // example ID
        cy.request('GET', `${baseUrl}/users/${userId}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property('id', userId);
            expect(response.body.data).to.have.property('email');
        });
    });

    // 3. Single User Not Found
    it('should return 404 when the user is not found', () => {
        cy.request({ url: `${baseUrl}/users/999`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    // 4. List Resources
    it('should retrieve a list of resources', () => {
        cy.request('GET', `${baseUrl}/unknown`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data[0]).to.have.property('name');
            expect(response.body.data[0]).to.have.property('year');
        });
    });

    // 5. Single Resource
    it('should retrieve a single resource by ID', () => {
        const resourceId = 2; // example ID
        cy.request('GET', `${baseUrl}/unknown/${resourceId}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.have.property('name');
            expect(response.body.data).to.have.property('year');
        });
    });

    // 6. Single Resource Not Found
    it('should return 404 when the resource is not found', () => {
        cy.request({ url: `${baseUrl}/unknown/999`, failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(404);
        });
    });

    // 7. Create User
    it('should create a new user', () => {
        const newUser = { name: "John", job: "developer" };
        cy.request('POST', `${baseUrl}/users`, newUser).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('createdAt');
        });
    });

    // 8. Update User (PUT)
    it('should update a user fully', () => {
        const updatedUser = { name: "John", job: "manager" };
        cy.request('PUT', `${baseUrl}/users/2`, updatedUser).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('name', 'John');
            expect(response.body).to.have.property('job', 'manager');
        });
    });

    // 9. Update User (PATCH)
    it('should update a user partially', () => {
        const updatedField = { job: "senior developer" };
        cy.request('PATCH', `${baseUrl}/users/2`, updatedField).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('job', 'senior developer');
        });
    });

    // 10. Delete User
    it('should delete a user', () => {
        cy.request('DELETE', `${baseUrl}/users/2`).then((response) => {
            expect(response.status).to.eq(204);
        });
    });

    // 11. Register - Successful
    it('should register a user successfully', () => {
        const credentials = { email: "eve.holt@reqres.in", password: "pistol" };
        cy.request('POST', `${baseUrl}/register`, credentials).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
        });
    });

    // 12. Register - Unsuccessful
    it('should handle unsuccessful registration', () => {
        const credentials = { email: "eve.holt@reqres.in" }; // missing password
        cy.request({ method: 'POST', url: `${baseUrl}/register`, failOnStatusCode: false, body: credentials })
            .then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('error');
            });
    });

    // 13. Login - Successful
    it('should login successfully', () => {
        const credentials = { email: "eve.holt@reqres.in", password: "cityslicka" };
        cy.request('POST', `${baseUrl}/login`, credentials).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
        });
    });

    // 14. Login - Unsuccessful
    it('should handle unsuccessful login', () => {
        const credentials = { email: "eve.holt@reqres.in" }; // missing password
        cy.request({ method: 'POST', url: `${baseUrl}/login`, failOnStatusCode: false, body: credentials })
            .then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.have.property('error');
            });
    });

    // 15. Delayed Response
    it('should handle delayed response', () => {
        cy.request('GET', `${baseUrl}/users?delay=3`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('data');
        });
    });
});

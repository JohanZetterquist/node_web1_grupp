const should = require('chai').should();
// const supertest = require('supertest');
const session = require('supertest-session');
const app = require('../app');
// const api = supertest(app);
const User = require('../models/user');
const randomstring = require('randomstring');

describe('Users', () => {
    //create "unique" username as to not conflict with existing username 
    const username = randomstring.generate();

    let api = null;

    beforeEach(() => api = session(app));

    // Remove User that gets created during testing
    after(() => {
        User.remove({ 'username': username }, error => {
            if (error) console.log(error)
        });
    });

    it('should create user and reroute to /', done => {
        api.post('/users/')
            .type('form')
            .send({
                username: username,
                password: '12345',
                firstname: 'Testy',
                lastname: 'Test'
            })
            .expect(302)
            .end((err, res) => {
                if (err) done(err)
                else {
                    res.header.location.should.equal('/');
                    done();
                }
            })
    })

    it('should return the requested user', done => {
        api.get(`/users/${username}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    res.body.should.have.property('_id');
                    res.body._id.should.not.equal(null);
                    done();
                }
            });
    });

    it('should login a user and reroute to /', done => {
        api.post('/users/login')
            .type('form')
            .send({
                'username': username,
                'password': '12345'
            })
            .expect(302)
            .end((err, res) => {
                if (err) done(err)
                else {
                    res.header.location.should.equal('/');
                    done();
                }
            });
    });

    it('should not login if username does not exist', done => {
        api.post('/users/login')
            .type('form')
            .send({
                'username': randomstring.generate(),
                'password': '12345'
            })
            .end((err, res) => {
                if (err) done(err)
                else {
                    api.get('/')
                        .end((err, res) => {
                            if (err) done(err)
                            else {
                                res.text.should.include('incorrect');
                                done();
                            }
                        });
                }
            });
    });

    it('should not login if password is incorrect', done => {
        api.post('/users/login')
            .type('form')
            .send({
                'username': username,
                'password': 'WrongPassword'
            })
            .end((err, res) => {
                if (err) done(err);
                else {
                    api.get('/')
                        .end((err, res) => {
                            if (err) done(err)
                            else {
                                res.text.should.include('incorrect');
                                done();
                            }
                        });
                }
            });
    });

    it('should logout a user and reroute to /', done => {
        api.get('/users/logout')
            .expect(302)
            .end((err, res) => {
                if (err) console.log(err)
                else {
                    res.header.location.should.equal('/');
                    done();
                }
            });
    });
});
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require("../models/userModel");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

//Parent block
describe('Users', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
           done();
        });
    });


    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
          chai.request(server)
              .get('/api/users')
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
                done();
              });
        });
    });

  //Test the /POST route
  describe('/POST users', () => {
      it('it should POST a user', (done) => {
        let user = {
            name: "Grisha",
            email: "grisha@m.ua",
            password: "123456",
            twitter_account: "account"
        }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.name.should.be.eql('Grisha');
              done();
            });
      });

      it('it should post not POST a user', (done) => {
        let badUser = {
            name: "Grisha",
            password: "123456",
            twitter_account: "account"
        }
        chai.request(server)
            .post('/api/users')
            .send(badUser)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                //console.log(res.body);
                res.body.should.have.property('message');
                res.body.message.should.have.property('errors');
                res.body.message.errors.should.have.property('email');
                res.body.message.errors.email.should.have.property('kind').eql('required');
              done();
            });
      });

  });

});

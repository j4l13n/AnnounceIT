/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../server';
import mockData from './data/mockData';

chai.use(chaiHttp);
chai.should();
let userToken = '';
const { expect } = chai;

describe('User tests', () => {
  it('should display a welcome message', (done) => {
    chai.request(server)
      .get('/api/v1/')
      .end((error, res) => {
        res.body.status.should.be.equal(200);
        expect(res.body.message).to.equal('Welcome to this API enjoy!');
        done();
      });
  });

  it('should be signup', (done) => {
    const user = mockData[5];
    chai.request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((error, res) => {
        userToken = res.body.data.token;
        res.body.status.should.be.equal(201);
        expect(res.body.message).to.equal('success');
        done();
      });
  });

  it('should create an announcement', (done) => {
    const user = mockData[6];
    chai.request(server)
      .post('/api/v1/announcement')
      .send(user)
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(201);
        expect(res.body.message).to.equal('success');
        done();
      });
  });
  it('should not create an announcement with invalid input', (done) => {
    const user = mockData[7];
    chai.request(server)
      .post('/api/v1/announcement')
      .send(user)
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(400);
        done();
      });
  });
  it('should not create an announcement if user did not sign in', (done) => {
    const user = mockData[6];
    chai.request(server)
      .post('/api/v1/announcement')
      .send(user)
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        expect(res.body.error).to.equal('Unauthorized access');
        done();
      });
  });
  it('should not create an announcement with invalid token', (done) => {
    const user = mockData[6];
    chai.request(server)
      .post('/api/v1/announcement')
      .send(user)
      .set('Authorization', 'Bearer undefined')
      .end((error, res) => {
        res.body.status.should.be.equal(401);
        expect(res.body.error).to.equal('Invalid token');
        done();
      });
  });
  it('should not create duplicated announcement', (done) => {
    const user = mockData[6];
    chai.request(server)
      .post('/api/v1/announcement')
      .send(user)
      .set('Authorization', `Bearer ${userToken}`)
      .end((error, res) => {
        res.body.status.should.be.equal(409);
        expect(res.body.error).to.equal('Announcement already exists');
        done();
      });
  });
});
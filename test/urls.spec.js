import app from '../index';
import chai, { expect } from "chai"
let chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

describe("Url tests", () => {
  it("should be able request a running server", (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      })
  });

  it('should return a short url', (done) => {
    chai.request(app)
      .post('/')
      .type('application/json')
      .send({
        url: 'www.google.com'
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.url).not.to.be.undefined;
        done();
      })
  });

  it('should return a full url', (done) => {
    chai.request(app)
      .get('/1')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.url).not.to.be.undefined;
        done();
      })
  });

  it('should return same full url on short url input', (done) => {
    let fullUrl = 'www.google.com';
    chai.request(app)
      .post('/')
      .type('application/json')
      .send({
        url: fullUrl
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.url).not.to.be.undefined;
        let url = res.body.url;
        chai.request(app)
          .get(`/${url}`)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.url).to.be.equal(fullUrl);
            done();
          });
      })
  });

  it('should return same short url on same full url input', (done) => {
    let fullUrl = 'www.google.com';
    chai.request(app)
      .post('/')
      .type('application/json')
      .send({
        url: fullUrl
      })
      .end((err, res) => {
        let shortUrl = res.body.url;
        chai.request(app)
          .post('/')
          .type('application/json')
          .send({
            url: fullUrl
          })
          .end((err, res) => {
            expect(shortUrl).to.be.equal(res.body.url);
            done();
          });
      })
  });
})
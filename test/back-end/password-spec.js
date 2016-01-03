require('chai').should();

var passwordLengthRE = /^.{8,}$/;
var passwordUpperCaseRE = /[A-Z]+/;
var passwordLowerCaseRE = /[a-z]+/;
var passwordNumbersRE = /[0-9]+/;
var passwordSpecialRE = /[?!@#$%^&*()]+/;
function passwordCheck(password) {
  var length = !!passwordLengthRE.exec(password);
  var upperCase = !!passwordUpperCaseRE.exec(password);
  var lowerCase = !!passwordLowerCaseRE.exec(password);
  var numbers = !!passwordNumbersRE.exec(password);
  var special = !!passwordSpecialRE.exec(password);
  return length && upperCase && lowerCase && numbers && special;
  // return !!passwordLengthRE.exec(password); //the !! essentially forces it to be a boolean -> inverts it twice
}

describe('password', function() {
  it('should not allow an empty password', function() {
    passwordCheck('').should.equal(false);
  });

  it('should not allow a password that is too short', function() {
    passwordCheck('abCD12?').should.equal(false);
  });

  it('should not allow a password that does not have an uppercase character', function() {
    passwordCheck('abcdefghijk123?').should.equal(false);
  });

  it('should not allow a password that does not have an lowercase character', function() {
    passwordCheck('ABCDEFGHIJK123?').should.equal(false);
  });

  it('should not allow a password that does not have any numbers', function() {
    passwordCheck('abcdeFGHIJK?').should.equal(false);
  });

  it('should not allow a password that does not have any special characters', function() {
    passwordCheck('abcdEFGH1234').should.equal(false);
  });

  it('should be a valid password', function() {
    passwordCheck('abc123XYZ??').should.equal(true);
  });
});
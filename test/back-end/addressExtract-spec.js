require('chai').should();

var myAddress = "Matthew Meister, 1201 West Mount Royal Ave, Baltimore, MD 21217";

function addressExtractor(address) {
  var parts = address.split(/\s*,\s*/);
  return {
    person: {
      firstName: address.match(/[a-zA-Z-']+(?= )/)[0],
      lastName: address.match(/[a-zA-Z-']+(?=,)/)[0]
    },
    address: {
      street: parts[1].match(/(?! )[a-zA-Z .-]+$/)[0],
      houseNumber: parts[1].match(/\d+[a-zA-Z]?/)[0],
      city: parts[2],
      state: parts[3].match()[0],
      zip: ''
    }
  };
}

describe('addressExtractor', function() {
  it('should extract the first name', function() {
    addressExtractor(myAddress).person.firstName.should.equal('Matthew');
  });

  it('should extract the last name', function() {
    addressExtractor(myAddress).person.lastName.should.equal('Meister');
  });

  it('should extract the street', function() {
    addressExtractor(myAddress).address.street.should.equal('West Mount Royal Ave');
  });

  it('should extract the house number', function() {
    addressExtractor(myAddress).address.houseNumber.should.equal('1201');
  });

  it('should extract the city', function() {
    addressExtractor(myAddress).address.city.should.equal('Baltimore');
  });
});
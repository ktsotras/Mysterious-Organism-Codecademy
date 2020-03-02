// Returns a random DNA base
const returnRandBase = () => {
  const dnaBases = ['A', 'T', 'C', 'G'];
  return dnaBases[Math.floor(Math.random() * 4)]; 
};

// Returns a random single stand of DNA containing 15 bases
const mockUpStrand = () => {
  const newStrand = [];
  for (let i = 0; i < 15; i++) {
    newStrand.push(returnRandBase());
  }
  return newStrand;
};

//compares all the DNA strands of the batch of pAequor objects and returns the most related pair in an array as pAequor objects
const compareBatchDNA = batch => {
  let mostRelate = 0;
  let mostRelatedPair = [ {}, {} ];
  //nested for loop to compare all the DNA
  for(let i = batch.length-1; i >= 1; i--){
    for(let j = i - 1; j >= 0; j--){
      let tempRelate = batch[i].compareDNA(batch[j]);
      //checking for error from compareDNA()
      if(tempRelate === -1){
        console.log('Error when comparing DNA!'); 
        return tempRelate;
      }
      //checks if the new compare percentage is higher than the current one
      if(tempRelate > mostRelate){
        mostRelate = tempRelate;
        //remove dummy arrays or lesser related pair
        mostRelatedPair.pop();
        mostRelatedPair.pop();
        //adding the new more related pair to the array
        mostRelatedPair.push(batch[i]);
        mostRelatedPair.push(batch[j]);
      } 
    } 
  }
  return mostRelatedPair;
};

const pAequorFactory = (specimenNum, dna) => {
  return {
    specimenNum,
    dna,
    //mutates one random DNA base to a different base
    mutate() {
      let idx = Math.floor(Math.random() * this.dna.length);
      let oldDNA = this.dna[idx];
      //keep looping only if the new random base is the same as the old base
      do{
        this.dna[idx] = returnRandBase();
      } while(oldDNA === this.dna[idx]);
      return this.dna;
    },
    //compares two DNA strands, prints to console the percentage in common and returns it as a number
    compareDNA(otherDNA) {
      let length = this.dna.length;
      //error checking for strands of differing lengths
      if(length != otherDNA.dna.length){
        console.log('Error: The two DNA sequences have different lengths.');
        return -1;
      }
      let pairs = 0;
      //loop through strands to find the number of bases in common
      for(let i = 0; i < length; i++){
        if(this.dna[i] === otherDNA.dna[i])
          pairs++;
      }
      //calculate the percentage of bases in common
      let average = Math.round(pairs/length * 100);
      console.log('specimen #'+this.specimenNum+' and specimen #'+otherDNA.specimenNum+' have '+average+'% DNA in common');
      return average;
    },
    //returns a boolean when the strand consists of 60% or more of 'C' or 'G' bases
    willLikelySurvive() {
      //use .filter to return an array of 'C' or 'G' bases found and compare that to the DNA length to calculate survival
      const pairsArray = this.dna.filter(base => base === 'C' || base === 'G');
      return pairsArray.length/this.dna.length >= .6;
    },
    //creates and returns a complementary DNA strand for the pAeqour its called on
    complementStrand() {
      let compStrand = [];
      //loops through the called on strand and adds the complement, 'A' to 'T', 'C' to 'G' and vice versa, to the compStrand variable
      for(let base of this.dna){
        switch(base){
          case 'A':
            compStrand.push('T');
            break;
          case 'T':
            compStrand.push('A');
            break;
          case 'C':
            compStrand.push('G');
            break;
          case 'G':
            compStrand.push('C');
            break;
        }
      }
      return compStrand;
    }
  };
};


let batch = [];
let idCounter = 1;
while(batch.length < 30){
  let tempPAequor = pAequorFactory(idCounter, mockUpStrand());
  if(tempPAequor.willLikelySurvive())
    batch.push(tempPAequor);
  idCounter++;
}

export const topics = { functions: 'Functions', calculus: 'Calculus', probability: 'Probability', statistics: 'Statistics' };
const choose = (n,k) => { let result=1; for(let i=1;i<=k;i++) result=result*(n-i+1)/i; return result; };
export function generateQuestion(topic, difficulty = 'medium', random = Math.random) {
  if (!Object.hasOwn(topics,topic) || !['easy','medium','hard'].includes(difficulty)) throw new Error('Choose a valid topic and difficulty');
  const pick=(a,b)=>a+Math.floor(random()*(b-a+1));
  const level=['easy','medium','hard'].indexOf(difficulty);
  let prompt, value, explanation, parameters, decimalPlaces=0;
  if(topic==='functions') {
    const a=pick(2,9), b=pick(1,12), x=pick(1,8);
    parameters={a,b,x,level};
    if(level===0){prompt=`For f(x) = ${a}x² + ${b}, find f(${x}).`;value=a*x*x+b;explanation=`Substitute x = ${x}: f(${x}) = ${a} × ${x}² + ${b} = ${value}.`;}
    else if(level===1){prompt=`For f(x) = ${a}e^(${x}x), find f(${b}/10). Give 4 decimal places.`;value=a*Math.exp(x*b/10);decimalPlaces=4;explanation=`Substitute x = ${b}/10 into the exponential: ${a} × e^(${x} × ${b}/10). Round only the final result.`;}
    else {prompt=`For f(x) = ${a}ln(x) + ${b}, find f(${x}). Give 4 decimal places.`;value=a*Math.log(x)+b;decimalPlaces=4;explanation=`The natural logarithm is defined here since ${x} > 0. Calculate ${a} × ln(${x}) + ${b}, then round the result.`;}
  } else if(topic==='calculus') {
    const a=pick(2,9), b=pick(1,12), x=pick(1,8); parameters={a,b,x,level};
    if(level===0){prompt=`For f(x) = ${a}x² + ${b}x, find the gradient at x = ${x}.`;value=2*a*x+b;explanation=`Differentiate using the power rule: f′(x) = ${2*a}x + ${b}. Substitute x = ${x} to get ${value}.`;}
    else if(level===1){prompt=`Evaluate the definite integral from 0 to ${x} of (${a}x² + ${b}) dx. Give 4 decimal places.`;value=a*x**3/3+b*x;decimalPlaces=4;explanation=`An antiderivative is ${a}x³/3 + ${b}x. Evaluate at ${x} and subtract the value at 0: ${a} × ${x}³/3 + ${b} × ${x}.`;}
    else {prompt=`For f(x) = (${a}x + ${b})³, find f′(${x}).`;value=3*a*(a*x+b)**2;explanation=`Use the chain rule: f′(x) = ${3*a}(${a}x + ${b})². Substitute x = ${x} to get ${value}.`;}
  } else if(topic==='probability') {
    const n=pick(5,20), p=pick(1,9)/10, k=pick(1,n-1);parameters={n,p,k,level};decimalPlaces=4;
    if(level===0){prompt=`Let X ~ Bin(${n}, ${p}). Find E(X). Give 4 decimal places.`;value=n*p;explanation=`For a binomial random variable, E(X) = np = ${n} × ${p}.`;}
    else if(level===1){prompt=`Let X ~ Bin(${n}, ${p}). Find P(X = ${k}). Give 4 decimal places.`;value=choose(n,k)*p**k*(1-p)**(n-k);explanation=`Use P(X = k) = C(n,k)p^k(1−p)^(n−k). Substitute n = ${n}, k = ${k}, p = ${p} and evaluate before rounding.`;}
    else {prompt=`Let X ~ Bin(${n}, ${p}). Find P(X ≤ ${k}). Give 4 decimal places.`;value=0;for(let i=0;i<=k;i++)value+=choose(n,i)*p**i*(1-p)**(n-i);explanation=`Sum the binomial probabilities from X = 0 through X = ${k}, or use a binomial cumulative distribution function with n = ${n} and p = ${p}.`;}
  } else {
    const n=pick(5,30)*20, successes=pick(1,19)*(n/20), proportion=successes/n;parameters={n,successes,level};decimalPlaces=4;
    const se=Math.sqrt(proportion*(1-proportion)/n);
    if(level===0){prompt=`A random sample of ${n} people contains ${successes} successes. Find the sample proportion p̂. Give 4 decimal places.`;value=proportion;explanation=`Divide successes by sample size: p̂ = ${successes}/${n}. This estimates the population proportion.`;}
    else if(level===1){prompt=`A random sample of ${n} has ${successes} successes. Estimate the standard error of p̂. Give 4 decimal places.`;value=se;explanation=`First p̂ = ${successes}/${n} = ${proportion}. Estimated SE = √[p̂(1−p̂)/n] = √[${proportion} × ${1-proportion} / ${n}].`;}
    else {prompt=`A random sample of ${n} has ${successes} successes. Using z = 1.96, find the margin of error for an approximate 95% confidence interval for the population proportion. Give 4 decimal places.`;value=1.96*se;explanation=`For this random sample, the success and failure counts are both at least 5. Use margin = 1.96√[p̂(1−p̂)/n], with p̂ = ${successes}/${n}. This is a normal approximation.`;}
  }
  const answer=decimalPlaces ? value.toFixed(decimalPlaces) : String(value);
  return {topic,prompt,answer,decimalPlaces,parameters,explanation:`${explanation} Answer: ${answer}.`};
}
export function generateWorksheet(topic,difficulty,count,random = Math.random) {
  if (!Number.isInteger(count) || count<1 || count>30) throw new Error('Choose between 1 and 30 questions');
  if (!Object.hasOwn(topics,topic) && topic!=='mixed') throw new Error('Choose a valid topic');
  const questions=[],seen=new Set(),keys=Object.keys(topics);
  for(let attempt=0;questions.length<count && attempt<1000;attempt++) {
    const question=generateQuestion(topic==='mixed'?keys[questions.length%keys.length]:topic,difficulty,random);
    if(!seen.has(question.prompt)){seen.add(question.prompt);questions.push(question);}
  }
  if(questions.length!==count)throw new Error('Could not create enough unique questions. Please try again.');
  return questions;
}

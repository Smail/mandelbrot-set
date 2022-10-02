Math.fac = function (x) {
  if (x < 0) throw new Error(`Cannot compute factorial of a negative value. Value is '${x}'`);

  function helper(x) {
    if (x <= 1) return 1;
    return x * helper(x - 1);
  }

  return helper(x);
}

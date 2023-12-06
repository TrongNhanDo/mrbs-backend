const checkEmpty = (value) => {
   if (value) {
      return value;
   }

   return '';
};

module.exports = {
   checkEmpty,
};

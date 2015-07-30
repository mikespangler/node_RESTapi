angular.module('firstApp', [])
  
  .controller('mainController', function(){
    // bind this to view-model
    var vm = this;
    vm.message = 'Hey there! Come and see how good I look!';

    vm.computers = [
      { name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
      { name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6 },
      { name: 'Chromebook', color: 'Black', nerdness: 5 },
    ];
  });

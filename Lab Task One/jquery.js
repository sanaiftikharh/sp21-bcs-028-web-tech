$(document).ready(function () {
  $("#regform").validate({
    rules: {
      name: {
        required: true,
        minlength: 4,
      },

      username: {
        required: true,
        minlength: 4,
      },
      email: {
        required: true,
        email: true, // Validates that the input is an email address
      },
      password: {
        required: true,
        minlength: 5,
      },
      Cpassword: {
        required: true,
        minlength: 5,
        equalTo: "#password",
      },
    },
    messages: {
      name: {
        required: "Please enter your firstname",
        minlength: "Enter username with atleast 4 characters.",
      },
      lname: "Please enter your last name",
      username: {
        required: "Please enter a username",
        minlength: "Enter username with atleast 4 characters.",
      },
      email: {
        required: "Please enter  email address",
        email: " Enter a valid email address",
      },
      password: {
        required: "Please enter your password.",
        minlength: "Enter a password with at least 5 characters.",
      },
      Cpassword: {
        required: "Confirm your password.",
        minlength: "Password is not matching.",
        equalTo: "Password is not matching.",
      },
    },
  });
});
$(document).ready(function () {
  $("#regform").submit(function (event) {
    event.preventDefault();
  });
});

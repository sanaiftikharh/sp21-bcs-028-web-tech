$(document).ready(function () {
  $("#regform").validate({
    rules: {
      name: "required",
      lname: "required",
      username: "required",
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
      name: "Please enter your first name",
      lname: "Please enter your last name",
      username: "Please enter a username",
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

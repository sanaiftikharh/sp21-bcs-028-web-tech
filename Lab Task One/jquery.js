$(function () {
  $("#registraionForm").validate({
    rules: {
      firstname: "required",
      username: {
        minlength: 4,
        required: true,
      },
      phonenumber: {
        Number: true,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 6,
      },
      confirmpassword: {
        required: true,
        minlength: 6,
        equalTo: "#password",
      },
    },
    messages: {
      firstname: "Please enter your firstname",
      lastname: "Please enter your lastname",
      username: {
        minlength: "Your username nust be of atleast 4 characters",
        required: "Username is required",
      },
      phonenumber: {
        Number: "Please enter in numbers",
      },
      email: {
        required: "Please enter your email",
      },
      password: {
        required: "Please enter a password",
        minlength: "Your password must be at least 6 characters long",
      },
      confirmpassword: {
        required: "Please enter a password",
        minlength: "Your password must be at least 6 characters long",
        equalTo: "Please Enter the same password as above",
      },
    },
  });
  $("#registrationForm").submit(function (event) {
    event.preventDefault();
    // Form validation has already been done.
    // You can handle further processing or submission here.
    // For example, you can send the data to the server via AJAX.
  });
});

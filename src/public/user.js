let user = "";

Swal.fire({
  title: "Login",
  text: "Please enter email address to login",
  input: "email",
  icon: "warning",
  allowOutsideClick: false,
}).then((response) => {
  user = response.value;
});

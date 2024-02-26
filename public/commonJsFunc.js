function refreshCaptcha() {
  fetch("/refresh-captcha")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("captchaImage").src =
        "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(data.captchaText);
    })
    .catch((error) => console.error("Error refreshing captcha:", error));
}
function togglePassword() {
  var passwordField = document.getElementById("password");
  var toggleIcon = document.getElementById("toggleIcon");

  if (passwordField.type == "password") {
    passwordField.type = "text";
    toggleIcon.innerHTML = '<i class="fas fa-eye"></i>';
  } else {
    passwordField.type = "password";
    toggleIcon.innerHTML = '<i class="fas fa-eye-slash"></i>';
  }
}
function toggleConfPassword() {
  var passwordField = document.getElementById("confPassword");
  var toggleIcon = document.getElementById("toggleConfIcon");

  if (passwordField.type == "password") {
    passwordField.type = "text";
    toggleIcon.innerHTML = '<i class="fas fa-eye"></i>';
  } else {
    passwordField.type = "password";
    toggleIcon.innerHTML = '<i class="fas fa-eye-slash"></i>';
  }
}

new DataTable("#example");

function chkdel(message) {
  return confirm(message);
}

function paysNow() {
  var name = $("#name").val();
  var amount = $("#amount").val();
  var invoice = $("#invoice").val();
  var total_products = $("#total_products").val();
  var deliver_address = $("#delivery_address").val();

  $.ajax({
    type: "post",
    url: "/checkoutBegin",
    data: { amount, name, invoice, total_products, deliver_address },
    success: function (response) {
      var options = {
        key: "rzp_test_vYw0QMxTGojoMY",
        amount: response.amount,
        currency: "INR",
        name: response.name,
        total_products: response.total_products,
        invoice: response.invoice,
        deliver_address: response.deliver_address,
        handler: function (response) {
          $.ajax({
            type: "post",
            url: "/checkoutPaymentComplete",
            data: { payment_id: response.razorpay_payment_id },
            success: function (result) {
              if (result.success) {
                alert("Payment successful.");
                window.location.href = "/account";
              } else {
                alert("Payment failed. Please try again.");
                window.location.href = "/account";
              }
            },
            error: function () {
              window.location.href = "/account";
            },
          });
        },
        closed: function () {
          window.location.href = "/account";
        },
      };

      var rzp1 = new Razorpay(options);
      rzp1.open();
    },
  });
}

function payNow() {
  var name = $("#name").val();
  var amount = $("#amount").val();
  var invoice = $("#invoice").val();
  var total_products = $("#total_products").val();
  var deliver_address = $("#delivery_address").val();

  $.ajax({
    type: "post",
    url: "/confirmOrderBegin",
    data: { amount, name, invoice, total_products, deliver_address },
    success: function (response) {
      var options = {
        key: "rzp_test_vYw0QMxTGojoMY",
        amount: response.amount,
        currency: "INR",
        name: response.name,
        total_products: response.total_products,
        invoice: response.invoice,
        deliver_address: response.deliver_address,
        handler: function (response) {
          $.ajax({
            type: "post",
            url: "/confirmOrderComplete",
            data: { payment_id: response.razorpay_payment_id },
            success: function (result) {
              if (result.success) {
                alert("Payment successful.");
                window.location.href = "/account";
              } else {
                alert("Payment failed. Please try again.");
                window.location.href = "/account";
              }
            },
            error: function () {
              window.location.href = "/account";
            },
          });
        },
        closed: function () {
          window.location.href = "/account";
        },
      };

      var rzp1 = new Razorpay(options);
      rzp1.open();
    },
  });
}

function addToCart() {
  var product_id = $(this).data("product-id");
  console.log(product_id);
  $.ajax({
    url: `/addToCart?product_id=${product_id}`,
    method: "GET",
    success: function (response) {
      if (
        response &&
        response.totalQuantity !== undefined &&
        response.totalAmount !== undefined
      ) {
        $('.nav-link.ms-2[href="/cart"] sup.fs-5').text(response.totalQuantity);

        const formattedAmount = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(parseFloat(response.totalAmount));
        $("#totalPriceLink").html(`Total Price: ${formattedAmount}`);

        alert("Item is added to cart");
      } else {
        console.error("Invalid response format:", response);
        alert("Error in Adding to cart");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX Error:", textStatus, errorThrown);
      alert("Please Login");
    },
  });
}

document
  .getElementById("searchTerm")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      submitForm();
    }
  });

function submitForm() {
  const searchValue = document.getElementById("searchTerm").value.trim();
  if (searchValue) {
    document.getElementById(
      "searchForm"
    ).action = `/search/${encodeURIComponent(searchValue)}`;
    document.getElementById("searchForm").submit();
  }
}

function updateQuantity() {
  const productId = $(this).data("product-id");
  const newQuantity = $(this).val();

  // Make an AJAX request to update the quantity in the server
  $.post("/updateQuantity", { productId, newQuantity })
    .done(function (response) {
      $("#totalQuantity").text(response.totalQuantity);
      $("#subtotalValue").text(response.totalAmount); // Make sure this ID matches your HTML
      alert(response.message);
    })
    .fail(function (error) {
      alert("Error updating quantity: " + error.responseJSON.message);
    });
}

function removeItem(e) {
  e.preventDefault();
  const productId = $(this).data("product-id");
  const $button = $(this);

  // Make an AJAX request to remove the item from the server
  $.post("/removeItem", { productId })
    .done(function (response) {
      $("#totalQuantity").text(response.totalQuantity);
      $("#subtotalValue").text(response.totalAmount); // Make sure this ID matches your HTML
      $("#noItemMessage").text(response.noItemMessage);
      alert(response.message);

      // Remove the row from the table
      $button.closest("tr").remove();

      // Optionally, redirect after some time
      setTimeout(function () {
        window.location.href = "/cart";
      }, 1000);
    })
    .fail(function (error) {
      alert("Error removing item: " + error.responseJSON.message);
    });
}

function fetchPendingOrders(event) {
  event.preventDefault();
  fetch("/getPendingOrders", {
    method: "POST", // Specify the method as POST
  })
    .then((response) => response.json())
    .then((data) => {
      const pendingOrdersCount = data.pendingOrdersCount;
      console.log("data.pendingOrdersCount", data.pendingOrdersCounts);
      const pendingOrdersContent = document.getElementById("profileSetting");
      if (pendingOrdersCount > 0) {
        const countContent = `<h3 class='text-center mt-5 mb-2 fs-1 text-success'>You have <span class='text-danger'>${pendingOrdersCount}</span> Pending Orders.</h3>
                        <p class='text-center'><a href="#" onclick="fetchUserOrders(event)" class='text-dark'>Order Details</a></p>`;
        pendingOrdersContent.innerHTML = countContent;
      } else {
        const exploreProductsLink = `<h3 class='text-center mt-5 mb-2 fs-1 text-success'>You have Zero Pending Orders.</h3>
                        <p class='text-center'><a href='/' class='text-dark'>Explore Products</a></p>`;
        pendingOrdersContent.innerHTML = exploreProductsLink;
      }
    })
    .catch((error) => {
      console.error("Error fetching pending orders:", error);
    });
}

function fetchUserOrders(event) {
  event.preventDefault();
  fetch("/myOrders", {
    method: "POST", // Specify the method as POST
  })
    .then((response) => response.json())
    .then((data) => {
      const profileSetting = document.getElementById("profileSetting");
      if (data.success && data.user_orders.length) {
        const groupedOrders = groupByAmountAndInvoice(data.user_orders);
        const ordersTableHTML = `
                    <h3 class="text-center text-success mt-5">All My Orders</h3>
                    <table class="table table-bordered mt-3">
                        <thead class="bg-info text-center">
                            <tr>
                                <th style="font-size:15px">Sr No.</th>
                                <th style="font-size:15px">Total Amount</th>
                                <th style="font-size:15px">Invoice Number</th>
                                <th style="font-size:15px">Product Name</th>
                                <th style="font-size:15px">Product Image</th>
                                <th style="font-size:15px">Quantity</th>
                                <th style="font-size:15px">Product Price</th>
                                <th style="font-size:15px">Date</th>
                                <th style="font-size:15px">Complete/Incomplete</th>
                                <th style="font-size:15px">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-secondary text-light text-center">
                        ${groupedOrders
                          .map((group, groupIndex) =>
                            group
                              .map(
                                (order, index) => `
                            <tr>
                            ${
                              index === 0
                                ? `<td rowspan="${
                                    group.length
                                  }" style="vertical-align:middle;font-size:15px">${
                                    groupIndex + 1
                                  }</td>`
                                : ""
                            }
                            ${
                              index === 0
                                ? `<td rowspan="${group.length}" style="vertical-align:middle;font-size:15px">${order.amount_due}</td>`
                                : ""
                            }
                            ${
                              index === 0
                                ? `<td rowspan="${group.length}" style="vertical-align:middle;font-size:15px">${order.invoice_number}</td>`
                                : ""
                            }
                            <td style="font-size:13px">${
                              order.product_title
                            }</td>
                            <td><img src="productsImages/${
                              order.product_image1
                            }" width="35px" height="35px" style="object-fit:contain"></td>
                            <td style="font-size:13px">${order.quantity}</td>
                            <td style="font-size:13px">${
                              order.product_price
                            }</td>
                            ${
                              index === 0
                                ? `<td rowspan="${
                                    group.length
                                  }" style="vertical-align:middle;font-size:15px">${formatDate(
                                    order.order_date
                                  )}</td>`
                                : ""
                            }
                            ${
                              index === 0
                                ? `<td rowspan="${
                                    group.length
                                  }" style="vertical-align:middle;font-size:15px">${
                                    order.order_status === "pending"
                                      ? "Incomplete"
                                      : "Complete"
                                  }</td>`
                                : ""
                            }
                           ${
                             index === 0
                               ? `
                            <td rowspan="${
                              group.length
                            }" style="vertical-align:middle">
                                ${
                                  order.order_status === "Complete"
                                    ? "Paid"
                                    : `
                                    <a href='/account/confirmOrders/${order.order_id}' class='text-light' style="font-size:12px">Confirm</a>
                                    <a href='#' class='text-light' onclick='confirmDel(event, ${order.order_id})' style="font-size:12px">Cancel</a>
                                `
                                }
                            </td>`
                               : ""
                           }

                            </tr>
                        `
                              )
                              .join("")
                          )
                          .join("")}
                        </tbody>
                    </table>`;

        profileSetting.innerHTML = ordersTableHTML;
      } else {
        profileSetting.innerHTML =
          '<h3 class="text-center text-danger fs-1 mt-5">No orders yet</h3>';
      }
    })
    .catch((error) => {
      console.error("Error fetching user orders:", error);
    });
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formattedDate = new Date(dateString).toLocaleDateString(
    "en-US",
    options
  );
  return formattedDate;
}

function groupByAmountAndInvoice(userOrders) {
  const groupedOrders = [];

  userOrders.forEach((order) => {
    const existingGroup = groupedOrders.find(
      (group) =>
        group[0].amount_due === order.amount_due &&
        group[0].invoice_number === order.invoice_number
    );

    if (existingGroup) {
      existingGroup.push(order);
    } else {
      groupedOrders.push([order]);
    }
  });

  return groupedOrders;
}

async function confirmDel(event, orderId) {
  event.preventDefault();
  if (confirm("Are you sure you want to cancel this order?")) {
    try {
      const response = await fetch(`/cancel-order/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Order canceled successfully.");
        await fetchUserOrders(event);
        console.log("FetchUserOrders completed.");
      } else {
        console.error("Failed to cancel order:", response.statusText);
      }
    } catch (error) {
      console.error("Error in the fetch request:", error);
    }
  }
}

async function fetchEditAccount(event) {
  event.preventDefault();

  // Fetch the edit account form
  try {
    const response = await fetch("/editAccount", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.text();
      $("#profileSetting").html(data);

      $("#profileSetting form").on("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(document.getElementById("yourFormId"));
        console.log([...formData.entries()]);

        try {
          const updateResponse = await fetch("/account/updateAccount", {
            method: "POST",
            body: formData,
          });

          if (updateResponse.ok) {
            const data = await updateResponse.json();
            console.log(data);

            const usernameErrorSpan = $("#yourFormId").find(
              ".text-danger-username"
            );
            const usermailErrorSpan = $("#yourFormId").find(
              ".text-danger-usermail"
            );
            const imageErrorSpan = $("#yourFormId").find(".text-danger-image");
            const addErrorSpan = $("#yourFormId").find(".text-danger-add");
            const contactErrorSpan = $("#yourFormId").find(
              ".text-danger-contact"
            );

            usernameErrorSpan.html("");
            usermailErrorSpan.html("");
            imageErrorSpan.html("");
            addErrorSpan.html("");
            contactErrorSpan.html("");
            if (Object.values(data.validate).every((value) => value === "")) {
              await updateFormDataInDatabase(formData);
            } else {
              usernameErrorSpan.html(data.validate.username_error || "");
              usermailErrorSpan.html(data.validate.usermail_error || "");
              imageErrorSpan.html(data.validate.image_error || "");
              addErrorSpan.html(data.validate.add_error || "");
              contactErrorSpan.html(data.validate.contact_error || "");
            }
          } else {
            console.error("Error updating account:", updateResponse.statusText);
          }
        } catch (error) {
          console.log("Error updating account:", error);
        }
      });
    } else {
      console.error(
        "Error fetching Edit Account content:",
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error fetching Edit Account content:", error);
  }
}

async function updateFormDataInDatabase(formData) {
  fetch("/account/updateFormDataInDatabase", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("data======", data);

      if (data.success) {
        alert("Updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.log("error");
      }
    })
    .catch((error) => {
      console.error("Error updating form data in the database:", error);
    });
}

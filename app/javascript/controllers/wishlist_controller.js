import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  updateWishlistStatus() {
    // Get status if user is logged-in
    // If logged-out, redirect to login page, return
    // else continue

    const isUserLoggedIn = this.element.dataset.userLoggedIn;
    if (isUserLoggedIn === "false") {
      document.querySelector(".js-login").click();
      return;
    }

    if (this.element.dataset.status === "false") {
      const propertyId = this.element.dataset.propertyId;
      const userId = this.element.dataset.userId;
      
      this.addPropertyToWishlist(propertyId, userId);
    } else {
        const wishlistId = this.element.dataset.wishlistId;
        this.removePropertyFromWishlist(wishlistId);
    }
  }
  addPropertyToWishlist(property_id, user_id) {
    const params = {
      property_id: property_id,

      user_id: user_id,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };

    fetch("/api/wishlists", options)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.status);
        }
        return response.json();
      })
      .then(data => {
        this.element.dataset.wishlistId = data.id;
        this.element.classList.remove("fill-none");
        this.element.classList.add("fill-primary");
        this.element.dataset.status = "true";
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removePropertyFromWishlist(id) {
    fetch("/api/wishlists/" + id, {
      method: "DELETE",
    })
      .then((response) => {
        this.element.dataset.wishlistId = '';
        this.element.classList.remove("fill-primary");
        this.element.classList.add("fill-none");
        this.element.dataset.status = "false";
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

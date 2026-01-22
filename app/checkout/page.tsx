import Container from "../components/container";
import FormWrap from "../components/form-wrap";
import CheckoutClient from "./checkout-client";
import getSettings from "@/actions/get-settings";
import getCurrentUser from "@/actions/get-current-user";

const Checkout = async () => {
  const settings = await getSettings();
  const currentUser = await getCurrentUser();

  return (
    <div className="-mt-20 sm:mt-0">
      <Container>
        <FormWrap>
          <CheckoutClient settings={settings} currentUser={currentUser} />
        </FormWrap>
      </Container>
    </div>
  );
};

export default Checkout;

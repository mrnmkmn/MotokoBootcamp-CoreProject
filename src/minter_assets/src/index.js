// The minter is the representation of the minter contract in main.mo but in JavaScript
import {
  minter
} from "../../declarations/minter";

// This is library to use with principal that is provided by Dfinity
import {
  Principal
} from "@dfinity/principal";

import {
  StoicIdentity
} from "ic-stoic-identity";

const connect_plug_button = document.getElementById("connect-plug");
connect_plug_button.addEventListener("click", connect_plug);

const connect_stoic_button = document.getElementById("connect-stoic");
connect_stoic_button.addEventListener("click", connect_stoic);

const mint_button = document.getElementById("mint");
mint_button.addEventListener("click", mint_nft);

async function connect_plug() {
  // Canister Ids
  const nnsCanisterId = 'ryjl3-tyaaa-aaaaa-aaaba-cai'

  // Whitelist
  const whitelist = [
    nnsCanisterId,
  ];

  // Make the request
  const isConnected = await window.ic.plug.requestConnect({
    whitelist,
  });

  // Get the user principal id
  const principalId = await window.ic.plug.agent.getPrincipal();

  // console.log(`Plug's user principal Id is ${principalId}`);
  let elmMyPrincipal = document.getElementById("my-principal");
  let elmPrincipal = document.getElementById("principal");
  if (elmPrincipal.value == "") {
    elmMyPrincipal.closest(".d-none").classList.remove("d-none");
  }
  elmMyPrincipal.innerHTML = `Your Plug Principal ID<br>${principalId}!`;
  elmPrincipal.value = principalId;

  // show_my_nfts(principalId);
}

async function connect_stoic() {
  StoicIdentity.load().then(async identity => {
    if (identity !== false) {
      //ID is a already connected wallet!
    } else {
      //No existing connection, lets make one!
      identity = await StoicIdentity.connect();
    }

    // Get the user principal id
    const principalId = identity.getPrincipal().toText();

    //Lets display the connected principal!
    // console.log(identity.getPrincipal().toText());
    let elmMyPrincipal = document.getElementById("my-principal");
    let elmPrincipal = document.getElementById("principal");
    if (elmPrincipal.value == "") {
      elmMyPrincipal.closest(".d-none").classList.remove("d-none");
    }
    elmMyPrincipal.innerHTML = `Your Stoic Principal ID<br>${principalId}!`;
    elmPrincipal.value = principalId;

    //Disconnect after
    StoicIdentity.disconnect();
  })

  // document.getElementById("my-principal").innerText = principalId;
}

async function mint_nft() {
  // Get the url of the image from the input field
  const name = document.getElementById("name").value.toString();
  console.log("The url we are trying to mint is " + name);

  // Get the principal from the input field.
  const principal_string = document.getElementById("principal").value.toString();
  const principal = Principal.fromText(principal_string);

  // Mint the image by calling the mint_principal function of the minter.
  const mintId = await minter.mint_principal(name, principal);
  console.log("The id is " + Number(mintId));
  // Get the id of the minted image.

  // Get the url by asking the minter contract.
  document.getElementById("preview-image").src = await minter.tokenURI(mintId);

  // Show some information about the minted image.
  document.getElementById("greeting").innerText = "this nft owner is " + principal_string + "\nthis token id is " + Number(mintId);
  document.getElementById("greeting").classList.remove("d-none");
}

async function show_my_nfts(pid) {
  // const tonkenUri = await minter.tokenURI(1);

  // console.log(myTokenURIs());
}
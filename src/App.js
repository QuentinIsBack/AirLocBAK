import { Routes, Route } from "react-router-dom";

import AuthenticatedRoute from './context/AuthenticatedRoute';

import SignModal from "./components/modal/ModalSignIn";

import Home from './pages/home';
import Hosting from './pages/hosting/hosting-loc';
import HostingMessages from './pages/hosting/messages';
import Account from './pages/account';
import AccountSettings from './pages/account-settings';
import AccountSettingsPersonnalInformations from './pages/account-settings/personnal-informations';
import AccountSettingsInvite from './pages/account-settings/invite';

function App() {
  return (
    <>
      <SignModal />

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route element={<AuthenticatedRoute />}>
          <Route exact path="/hosting" element={<Hosting />} />
          <Route exact path="/hosting/messages" element={<HostingMessages />} />
          <Route exact path="/account" element={<Account />} />
          <Route exact path="/account-settings" element={<AccountSettings />} />
          <Route exact path="/account-settings/personnal-informations" element={<AccountSettingsPersonnalInformations />} />
          <Route exact path="/account-settings/invite" element={<AccountSettingsInvite />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

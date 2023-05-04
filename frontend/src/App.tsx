import './App.css';
import { Container, CssBaseline, } from '@mui/material';
import { useWindowSize } from 'react-use';
import React, { useEffect } from 'react';

import SignIn from 'pages/Login';
import { Route, Routes } from 'react-router-dom';
import { PrivateLayout, PublicLayout } from 'routes/Layout';
import CardLoading from 'components/loading/CardLoading';
import Register from 'pages/Register';
import Logout from 'pages/Logout';
import * as NoteApi from "network/api_helper"
import { Context, ContextType } from 'util/provider';

const Notes = React.lazy(() => import('pages/Notes'));

function App() {
  const { width } = useWindowSize()
  const { setUser } = React.useContext(Context) as ContextType;

  const token = sessionStorage.getItem("token")

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await NoteApi.getLoggedInUser()
        setUser(user)
      } catch (error) {
        console.log(error)
      }
    }
    if (token) {
      fetchLoggedInUser()
    }
  }, [setUser, token])


  return (
    <div className="App">
      <CssBaseline />
      <Container sx={{ position: "relative", }} className='sm:p-0' maxWidth={width > 768 ? "md" : "sm"}>
        <Routes>
          <Route element={<PrivateLayout />}>
            <Route path="/" element={
              <React.Suspense fallback={<CardLoading count={4} />}>
                <Notes />
              </React.Suspense>
            } />
          </Route>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Routes>
      </Container>
    </div >
  );
}

export default App;


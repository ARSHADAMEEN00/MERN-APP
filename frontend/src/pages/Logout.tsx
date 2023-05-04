import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Backdrop, CircularProgress } from '@mui/material';
import * as Api from "network/api_helper"
import { useNavigate } from 'react-router-dom';

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                osperbnotes
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();



export default function Logout() {
    const navigate = useNavigate()

    React.useEffect(() => {
        const logout = async () => {
            try {
                await Api.logout()
                navigate('/login')
                sessionStorage.clear()
            } catch (error) {
                alert(error);
            }
        }

        logout()
    }, [navigate])


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ minHeight: '70vh' }}>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </Container>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </ThemeProvider>
    );
}
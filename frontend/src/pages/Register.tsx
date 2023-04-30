import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Context, ContextType } from 'util/provider';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as Api from "network/api_helper"

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

type Inputs = {
    username: string,
    password: string,
    email: string,
};

export default function Register() {
    const navigate = useNavigate()
    const { setUser, user } = React.useContext(Context) as ContextType;

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (credentials, e) => {
        e?.preventDefault()

        try {
            const user = await Api.signUp(credentials)
            alert('success');
            navigate('/login')
        } catch (error) {
            alert(error);
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form onSubmit={handleSubmit((value, e) => onSubmit(value, e))}>
                        <Box sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="user"
                                label="User Name"
                                type='text'
                                autoComplete="user"
                                autoFocus
                                {...register('username', { required: true })}
                                error={!!errors.username}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                type='email'
                                label="Email Address"
                                autoComplete="email"
                                autoFocus
                                {...register('email', { required: true })}
                                error={!!errors.email}

                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                {...register('password', { required: true })}
                                error={!!errors.password}

                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting}
                            >
                                Sign Up
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="#" variant="body2">
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        {"I have an account? Sign In"}
                                    </Link>
                                </Grid>
                            </Grid>


                        </Box>
                    </form>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
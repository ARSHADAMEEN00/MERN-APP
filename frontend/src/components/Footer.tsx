import React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import { styled } from '@mui/material/styles';
import ArchiveIcon from '@mui/icons-material/Archive';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import SaveIcon from '@mui/icons-material/Save';
import { Context, ContextType } from 'util/provider';

export default function Footer() {
    const { setChangeMobileNav, mobileNav } = React.useContext(Context) as ContextType;

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setChangeMobileNav(newValue);
    };

    return (
        <FooterContainer >
            <BottomNavigation value={mobileNav} onChange={handleChange}>
                <BottomNavigationAction
                    label="Recent"
                    value="recent"
                    icon={<RestoreIcon />}
                />
                <BottomNavigationAction
                    label="All Notes"
                    value="favorites"
                    icon={<AlignHorizontalLeftIcon />}
                />
                <BottomNavigationAction
                    label="Archived"
                    value="nearby"
                    icon={<ArchiveIcon />}
                />
                <BottomNavigationAction label="Saved" value="folder" icon={<SaveIcon />} />
            </BottomNavigation>
        </FooterContainer>
    );


}


const FooterContainer = styled('div')(({ theme }) => ({

}))

// const Search = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//         backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     marginRight: theme.spacing(2),
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//         marginLeft: theme.spacing(3),
//         width: 'auto',
//     },
// }));
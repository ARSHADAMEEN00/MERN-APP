import { Box, IconButton } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import { logo } from 'assets/image';
import TinderCard from 'components/tinderChat/TinderCard';
import { FlashOn, Favorite, StarRate, Close, Replay } from '@mui/icons-material';

function TinderChat() {
    return (
        <div style={{ position: "relative" }} className='main_wrap'>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton  >
                    <PersonIcon fontSize="large" className="header_icon" />
                </IconButton>
                <IconButton >
                    <img src={logo} alt='logo' height={50} width={50} />
                </IconButton>
                <IconButton >
                    <RateReviewRoundedIcon fontSize="large" className="header_icon" />
                </IconButton>
            </Box>

            <TinderCard />

            <Box sx={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }} className="swipeButtons">
                <IconButton className="swipeButton repeat">
                    <Replay fontSize="large" />
                </IconButton>
                <IconButton className="swipeButton close">
                    <Close fontSize="large" />
                </IconButton>
                <IconButton className="swipeButton star">
                    <StarRate fontSize="large" />
                </IconButton>
                <IconButton className="swipeButton favorite">
                    <Favorite fontSize="large" />
                </IconButton>
                <IconButton className="swipeButton flashOn">
                    <FlashOn fontSize="large" />
                </IconButton>
            </Box>
        </div>
    )
}

export default TinderChat
import { Box, Grid, Skeleton } from '@mui/material'
import { range } from 'util/range'


interface loadingProp {
    count: number
}

function CardLoading({ count }: loadingProp) {

    return (
        <Box sx={{ display: 'flex', alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            {range(1, count ? count : 1, 1)?.map((l: any) => (
                <Grid key={l} container wrap="nowrap" sx={{ width: "180px", margin: "0 10px" }}>
                    <Box sx={{ width: 210, marginRight: 0.5, my: 5 }}>
                        <Skeleton variant="rectangular" width={180} height={118} />
                        <Box sx={{ pt: 0.5 }}>
                            <Skeleton />
                            <Skeleton width="60%" />
                        </Box>
                    </Box>
                </Grid>
            ))
            }
        </Box>

    )
}

export default CardLoading
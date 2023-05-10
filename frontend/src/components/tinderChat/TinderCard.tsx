import { noImage } from 'assets/image'
import TinderCard from "react-tinder-card"

function Tinder() {
    const data = [
        {
            name: "aemeen",
            images: noImage
        },
        {
            name: "arshad",
            images: noImage
        },
    ]

    const onSwipe = (direction: any, item: string) => {
        console.log('You swiped: ' + direction)
    }

    const onCardLeftScreen = (myIdentifier: string) => {
        console.log(myIdentifier + ' left the screen')
    }

    return (
        <div className="tinderCard_wrap">
            <div className="tinderCards_cardContainer">
                {data?.map((i, key) => (
                    <TinderCard
                        key={key}
                        className="swipe"
                        preventSwipe={['up', 'down']}
                        onSwipe={(dir) => onSwipe(dir, i.name)}
                        onCardLeftScreen={() => onCardLeftScreen(i.name)}
                    >
                        <div
                            className='tinderCard'
                            style={{
                                backgroundImage: `url(${i.images})`
                            }} >
                            <h3>
                                {i.name}
                            </h3>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    )
}

export default Tinder
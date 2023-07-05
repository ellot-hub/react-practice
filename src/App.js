import React from "react"
import './App.css';
import Title from './components/Title'

const jsonLocalStorage = {
    setItem: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
};

const fetchCat = async (text) => {
    const OPEN_API_DOMAIN = "https://cataas.com";
    const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
    const responseJson = await response.json();
    return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const CatItem = (props) => {
    return (
        <li>
            <img src={props.img} style={{width: "150px"}}/>
            <p>{props.title}</p>
        </li>
    );
}

const Favorites = ({favorites}) => {

    if(favorites.length === 0 ) {
        return (
            <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
        )
    }

    return (
        <ul className="favorites">
            {favorites.map((cat, index) => (
                <CatItem img={cat} key={index}/>
            ))}
        </ul>
    )
}


const Form = ({updateMainCat}) => {
    const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
    const [value, setValue] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("")

    const handleInputChange = (e) => {
        const userValue = e.target.value;
        setErrorMessage("")

        if(includesHangul(userValue)) {
            setErrorMessage("한글은 입력 불가능합니다.")
        }
        setValue(userValue.toUpperCase())
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setErrorMessage("")

        if(value === ""){
            setErrorMessage("빈값으로 만들 수 없습니다.")
            return;
        }
        updateMainCat(value);
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <input type="text" name="name" value={value} placeholder="영어 대사를 입력해주세요" onChange={handleInputChange} />
            <p style={{color: "red"}}>{errorMessage}</p>
            <button type="submit">생성</button>
        </form>
    )
}

const MainCard = ({img, onHeartClick, alreadyFavorite}) => {
    const EMPTY_HEART = "🤍";
    const FULL_HEART = "💖";

    const heartIcon = alreadyFavorite ? FULL_HEART : EMPTY_HEART;
    return (
        <div className="main-card">
            <img
                src={img}
                alt="고양이"
                width="400"
            />
            <button onClick={onHeartClick}>{heartIcon}</button>
        </div>
    )
}

const App = () => {
    const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
    // const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
    // const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

    const [mainCat, setMainCat] = React.useState(CAT1);
    const [counter, setCounter] = React.useState(()=> {
        return jsonLocalStorage.getItem("counter");
    })
    const [favorites, setFavorites] = React.useState(()=> {
        return jsonLocalStorage.getItem("favorites") || [];
    })
    const alreadyFavorite = favorites.includes(mainCat);

    const setInitialCat = async() => {
        const newCat = await fetchCat("First cat");
        setMainCat(newCat)
    }

    // 빈배열: 최초에만 호출할때
    React.useEffect(()=> {
        setInitialCat();
    }, [])

    // counter 값이 변경될떄마다 찍힘
    React.useEffect(()=> {
        console.log("hi");
    }, [counter])


    const updateMainCat = async (value) => {
        const newCat = await fetchCat(value);

        setMainCat(newCat);
        setCounter((prev) => {
            const nextCounter = prev + 1;
            jsonLocalStorage.setItem("counter", nextCounter)
            return nextCounter;
        })
    }

    const handleHeartClick = () => {
        const nextFavorites = [...favorites, mainCat]
        setFavorites(nextFavorites);
        jsonLocalStorage.setItem("favorites", nextFavorites)
    }

    const counterTitle = !counter ? "" : `${counter}번째 `

    return (
        <div>
            <Title>{counterTitle}고양이 가라사대</Title>
            <Form updateMainCat={updateMainCat} />
            <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite}/>
            <Favorites favorites={favorites}/>
        </div>
    )
}

export default App;

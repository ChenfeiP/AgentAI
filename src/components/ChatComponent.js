import React, { useState } from "react"; // Import useState
import axios from "axios";
import { Input } from "antd";

const { Search } = Input;

const DOMAIN = "http://localhost:5001";

const searchContainer = {
  display: "flex",
  justifyContent: "center",
};

const ChatComponent = (props) => {
    const {handleResp, isLoading, setIsLoading} = props;
    const[searchValue, setSearchValue] = useState("");
    const onSearch = async (question) => {

        setSearchValue("");
        setIsLoading(true);
        try {
            const response = await axios.get(`${DOMAIN}/chat`, {
              params: {
                question,
              },
            });
            handleResp(question, response.data);
        } catch (error) {
            console.error(`Error: ${error}`);
            handleResp(question, error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setSearchValue(e.target.value);
    };

    return (
        <div style={searchContainer}>
            <Search
                placeholder="input search text"
                enterButton="Ask"
                size="large"
                value={searchValue}
                onChange={handleChange}
                onSearch={onSearch}
                loading={isLoading}
            />
        </div>
    );
};

export default ChatComponent;
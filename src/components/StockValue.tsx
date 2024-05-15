import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import privateAxios from "../app/axios";
import { useQuery } from "react-query";

type TStockValue = {
    selectedWatchlist: number | null;
};

interface TimeSeriesData {
    [key: string]: {
        "1. open": string;
        "2. high": string;
        "3. low": string;
        "4. close": string;
        "5. volume": string;
    };
}

interface StockData {
    [key: string]: any;
    "Time Series (5min)": TimeSeriesData;
}

const StockValue = ({ selectedWatchlist }: TStockValue) => {
    const [stockData, setstockData] = useState<StockData[]>([]);
    const [isOriginal, setIsOriginal] = useState<boolean>(false);
    const watchlistQueryById = useQuery({
        queryKey: ["my/watchlist", selectedWatchlist],
        enabled: selectedWatchlist ? true : false,
        queryFn: async () => {
            const res = await privateAxios.get(
                `/watchlist/edit?watchlist_id=${selectedWatchlist}`
            );
            return res.data?.data;
        },
    });

    const getStockValues = async () => {
        const symbol = watchlistQueryById.data?.symbol?.split(",");
        let urls: string[] = [];
        if (symbol) {
            for (let s of symbol) {
                let stockSymbol = s;
                if (s?.includes(".")) {
                    stockSymbol = s?.split(".")[0];
                }
                urls.push(
                    `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}&interval=5min&apikey=${process.env.REACT_APP_STOCK_API}`
                );
            }
        }
        const fetchStockValues = async () => {
            try {
                const responses = await Promise.all(
                    urls.map((url) => privateAxios.get(url))
                );
                return responses.map((res) => res.data);
            } catch (error) {
                console.log("error");
            }
        };
        let data = await fetchStockValues();
        setIsOriginal(true);
        if (data && data.find((d) => d["Information"])) {
            urls = [];
            if (symbol) {
                for (let s of symbol) {
                    urls.push(`/stockvalues?s=${s}`);
                }
            }
            const fetchStockValues = async () => {
                const responses = await Promise.all(
                    urls.map((url) => privateAxios.get(url))
                );
                return responses.map((res) => res.data); // Assuming you want to return the data from each request
            };
            setIsOriginal(false);

            data = await fetchStockValues();
        }
        setstockData(data || []);
        return data;
    };

    useEffect(() => {
        getStockValues();
    }, [selectedWatchlist, watchlistQueryById.data]);

    return (
        <Box px={6} mt={4}>
            {!isOriginal && (
                <Typography
                    textAlign={"center"}
                    sx={{ width: "700px", mx: "auto" }}
                >
                    Since Alpha vantage API has rate limit of 25 request per
                    day. Below data is showing directly from database for demo
                    purpose{" "}
                    <Typography
                        component={"span"}
                        sx={{ fontWeight: "bold", fontSize: "14px" }}
                    >
                        (Once Rate Limit is over it will show from API)
                    </Typography>
                </Typography>
            )}
            <Typography mt={1} fontWeight={500}>
                Stock Values
            </Typography>

            {stockData.length >= 1 &&
                stockData?.map((item, index) => (
                    <Box mt={1} key={index}>
                        <h2>Symbol: {item["Meta Data"]["2. Symbol"]}</h2>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date/Time</TableCell>
                                        <TableCell>Open</TableCell>
                                        <TableCell>High</TableCell>
                                        <TableCell>Low</TableCell>
                                        <TableCell>Close</TableCell>
                                        <TableCell>Volume</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(
                                        item["Time Series (5min)"]
                                    ).map(([dateTime, values]) => (
                                        <TableRow key={dateTime}>
                                            <TableCell>{dateTime}</TableCell>
                                            <TableCell>
                                                {values["1. open"]}
                                            </TableCell>
                                            <TableCell>
                                                {values["2. high"]}
                                            </TableCell>
                                            <TableCell>
                                                {values["3. low"]}
                                            </TableCell>
                                            <TableCell>
                                                {values["4. close"]}
                                            </TableCell>
                                            <TableCell>
                                                {values["5. volume"]}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))}
        </Box>
    );
};

export default StockValue;

import { Box, Button, Typography } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useAuth } from "./Context/AuthContext";
import { ReactComponent as NoDataSvg } from "./assets/no-data.svg";
import { useEffect, useState } from "react";
import WatchListModal from "./components/WatchListModal";
import { useMutation, useQuery } from "react-query";
import privateAxios from "./app/axios";
import WatchListCard from "./components/WatchListCard";
import StockValue from "./components/StockValue";

export type TSymbol = {
    name: string;
    symbol: string;
    title?: string;
};

type TWatchList = {
    title: string;
    symbol: string;
    id: number;
    author: {
        name: string;
        email: string;
    };
};

const Home = () => {
    const { user } = useAuth();
    const [openWatch, setOpenWatchList] = useState(false);
    const [selectedWatchlist, setSelectedWatchlist] = useState<number | null>(
        null
    );
    const [selectedSymbol, setSelectedSymbol] = useState<TSymbol[]>([]);
    const [watchListTitle, setWatchListTitle] = useState<string>("");
    const [editWatchlistId, setEditWatchlistId] = useState<number | null>(null);

    const watchlistQuery = useQuery<TWatchList[]>({
        queryKey: ["my/watchlist"],
        queryFn: async () => {
            const res = await privateAxios.get("/watchlist");
            return res.data?.data;
        },
    });
    const watchlistQueryById = useMutation({
        mutationKey: ["my/watchlist"],
        mutationFn: async (id: number) => {
            const res = await privateAxios.get(
                `/watchlist/edit?watchlist_id=${id}`
            );
            return res.data?.data;
        },
        onSuccess: (data: TSymbol) => {
            if (data) {
                const symbol = data?.symbol?.split(",")?.map((s) => {
                    return {
                        symbol: s,
                        name: s,
                    };
                });
                setWatchListTitle(data.title!);
                setSelectedSymbol(symbol);
                setOpenWatchList(true);
            }
        },
    });

    useEffect(() => {
        if (watchlistQuery.data && watchlistQuery.data?.length >= 1) {
            setSelectedWatchlist(watchlistQuery.data[0].id);
        }
    }, [watchlistQuery.data]);

    const onEditWatchList = (watchlist_id: number) => {
        setEditWatchlistId(watchlist_id);
        watchlistQueryById.mutate(watchlist_id);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box sx={{ width: "100%", paddingLeft: "250px" }}>
                <Header />
                <WatchListModal
                    showModal={openWatch}
                    handleClose={() => setOpenWatchList(false)}
                    setSelectedSymbol={setSelectedSymbol}
                    setWatchListTitle={setWatchListTitle}
                    selectedSymbol={selectedSymbol}
                    watchListTitle={watchListTitle}
                    editWatchlistId={editWatchlistId}
                    setEditWatchlistId={setEditWatchlistId}
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: "40px",
                    }}
                >
                    <Box sx={{ display: "flex", gap: 1, p: "20px" }}>
                        <Typography variant="h4">Hi,</Typography>
                        <Typography variant="h4" textTransform={"capitalize"}>
                            {user.name}
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            onClick={() => setOpenWatchList(true)}
                            variant="contained"
                        >
                            Create WatchList
                        </Button>
                    </Box>
                </Box>

                {watchlistQuery.data && watchlistQuery.data?.length >= 1 ? (
                    <Box px={4}>
                        <Typography variant="h6" mb={1} px={2}>
                            My Watchlists
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                gap: "14px",
                                px: "20px",
                                flexWrap: "wrap",
                            }}
                        >
                            {watchlistQuery.data?.map((data) => {
                                return (
                                    <WatchListCard
                                        onClick={(id) => {
                                            setSelectedWatchlist(id);
                                        }}
                                        onEditWatchList={onEditWatchList}
                                        selectedWatchlist={selectedWatchlist}
                                        key={data.id}
                                        {...data}
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "60vh",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <NoDataSvg width={200} height={200} />
                            <Typography pt={1} fontWeight={500}>
                                No Watch List Found...
                            </Typography>
                        </Box>
                    </Box>
                )}
                <Box>
                    {selectedWatchlist && (
                        <StockValue selectedWatchlist={selectedWatchlist} />
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default Home;

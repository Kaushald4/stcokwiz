import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce";
import privateAxios from "../app/axios";
import { useMutation, useQueryClient } from "react-query";
import toast from "react-hot-toast";

type TSymbol = {
    name: string;
    symbol: string;
};

type TWatchListModalProps = {
    showModal: boolean;
    handleClose: () => void;
    setSelectedSymbol: (value: TSymbol[]) => void;
    setWatchListTitle: (value: string) => void;
    selectedSymbol: TSymbol[];
    watchListTitle: string;
    editWatchlistId: number | null;
    setEditWatchlistId: (value: number | null) => void;
};

type TSymbolPayload = {
    title: string;
    symbol: string;
};

type TSymbolSearch = {
    [key: string]: string;
};

const WatchListModal = ({
    handleClose,
    showModal,
    selectedSymbol,
    setSelectedSymbol,
    setWatchListTitle,
    watchListTitle,
    editWatchlistId,
    setEditWatchlistId,
}: TWatchListModalProps) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly TSymbol[]>([]);
    const loading = open && options.length === 0;
    const [symbol, setSymbol] = useState<string>("");

    const throttledSymbol = useDebounce<string>(symbol, 500);

    const getSearchSuggestions = useCallback(async () => {
        setOpen(true);
        let url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${
            throttledSymbol || "T"
        }&apikey=A08G46E43REOTWMI`;

        let response = await axios.get(url);

        if (response.data?.Information) {
            url = `/symbol?query=${throttledSymbol || "all"}`;
        }
        response = await privateAxios.get(url);

        if (response.data?.bestMatches?.length >= 1) {
            const symbolData = response.data?.bestMatches?.map(
                (symbol: TSymbolSearch) => {
                    return {
                        name: symbol["2. name"] || symbol["name"],
                        symbol: symbol["1. symbol"] || symbol["symbol"],
                    };
                }
            );
            setOptions(symbolData);
        }
    }, [throttledSymbol]);

    useEffect(() => {
        getSearchSuggestions();
    }, [getSearchSuggestions, throttledSymbol]);

    const symbolMutation = useMutation({
        mutationKey: ["save/watchlist"],
        mutationFn: async (data: TSymbolPayload) => {
            return await privateAxios.post("/watchlist", data);
        },
        onSuccess: (data) => {
            toast.success(
                editWatchlistId ? "Watchlist Updated" : "Watchlist Created"
            );
            setOpen(false);
            setOptions([]);
            setSelectedSymbol([]);
            handleClose();
            setWatchListTitle("");
            setEditWatchlistId(null);
            queryClient.invalidateQueries("my/watchlist");
        },
    });

    const saveWatchList = () => {
        if (!watchListTitle.length || !selectedSymbol.length) {
            toast.error(
                "Select WatchList title and Symbol to create watchlist"
            );
            return;
        }

        const symbol = selectedSymbol.map((s) => s.symbol);
        const data = {
            title: watchListTitle,
            symbol: symbol.join(","),
            id: editWatchlistId,
        };
        symbolMutation.mutate(data);
    };

    return (
        <Modal
            open={showModal}
            onClose={(_e, reason) => {
                if (reason && reason === "backdropClick") return;
                handleClose();
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    bgcolor: "white",
                    maxWidth: "500px",
                    mx: "auto",
                    borderRadius: 1,
                    p: "20px",
                }}
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Create New WatchList
                </Typography>
                <Box mt={2}>
                    <TextField
                        label="WatchList Title"
                        sx={{ mb: "20px" }}
                        onChange={(e) => {
                            setWatchListTitle(e.target.value);
                        }}
                        value={watchListTitle}
                        fullWidth
                    />
                    <Autocomplete
                        ListboxProps={{ style: { maxHeight: 150 } }}
                        multiple
                        open={open}
                        onChange={(event, value) => {
                            setSelectedSymbol(value);
                        }}
                        value={selectedSymbol}
                        onOpen={() => {}}
                        onClose={() => {
                            setOpen(false);
                        }}
                        isOptionEqualToValue={(option, value) =>
                            option.symbol === value.symbol
                        }
                        getOptionLabel={(option) => option.symbol}
                        options={options}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                onClick={() => {
                                    getSearchSuggestions();
                                }}
                                label="Enter Symbol"
                                onChange={(e) => {
                                    const symbol = e.target.value;
                                    console.log(symbol);
                                    setSymbol(symbol);
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            mt: "40px",
                            justifyContent: "flex-end",
                            gap: "20px",
                            height: "180px",
                            alignItems: "flex-end",
                        }}
                    >
                        <Button
                            onClick={() => {
                                handleClose();
                                setOpen(false);
                            }}
                            variant="contained"
                            color="error"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={saveWatchList}
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default WatchListModal;

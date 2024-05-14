import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Typography,
    useTheme,
} from "@mui/material";
import React from "react";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useMutation, useQueryClient } from "react-query";
import privateAxios from "../app/axios";
import toast from "react-hot-toast";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type TWatchListCardProps = {
    title: string;
    symbol: string;
    id: number;
    onClick: (id: number) => void;
    selectedWatchlist: number | null | undefined;
    onEditWatchList: (watchlist_id: number) => void;
};

type TDeletePayload = {
    watchlist_id: number;
};

const WatchListCard = ({
    id,
    symbol,
    title,
    onClick,
    selectedWatchlist,
    onEditWatchList,
}: TWatchListCardProps) => {
    const theme = useTheme();
    const queryClient = useQueryClient();

    const bgcolor =
        selectedWatchlist === id ? theme.palette.secondary.main : "white";
    const color = selectedWatchlist === id ? "white" : "black";
    const deletetextColor =
        selectedWatchlist === id ? "white" : theme.palette.error.main;
    const edittextColor =
        selectedWatchlist === id ? "white" : theme.palette.secondary.main;
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const deleteMutation = useMutation({
        mutationKey: ["delete/watchlist"],
        mutationFn: async (data: TDeletePayload) => {
            const res = await privateAxios.delete(`/watchlist`, {
                data: data,
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success("WatchList Deleted");
            queryClient.invalidateQueries("my/watchlist");
        },
    });

    const handleDelete = (watchlist_id: number) => {
        deleteMutation.mutate({ watchlist_id });
    };

    return (
        <div
            onClick={() => {
                onClick(id);
            }}
        >
            <Box sx={{ cursor: "pointer" }}>
                <Paper
                    sx={{
                        bgcolor,

                        pt: "20px",
                        width: "240px",
                        color,
                    }}
                >
                    <Box px={"20px"}>
                        <Typography>{title}</Typography>
                        <Typography sx={{ wordWrap: "break-word" }} mt={2}>
                            {symbol}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mt: 3 }}>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditWatchList(id);
                            }}
                            sx={{ color: edittextColor }}
                            fullWidth
                            color="secondary"
                        >
                            Edit
                        </Button>
                        <Button
                            color="error"
                            sx={{ color: deletetextColor }}
                            fullWidth
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpen(true);
                            }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Are you sure want to delete it?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        You will not be able to monitor the stock symbols.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(id);
                            handleClose();
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default WatchListCard;

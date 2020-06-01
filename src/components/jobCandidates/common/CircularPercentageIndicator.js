import {useTheme} from "@material-ui/styles";
import {CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import React from "react";

export default function CircularPercentageIndicator({percentage}) {
    const theme = useTheme()

    return (
        <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            strokeWidth={2}
            styles={{
                path: {
                    stroke: theme.palette.primary.main
                },
                trail: {
                    stroke: '#fff'
                },
                text: {
                    fill: theme.palette.primary.main
                }
            }}
        />
    )
}
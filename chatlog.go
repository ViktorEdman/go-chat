package main

import (
	"fmt"
	"os"
)

const LOGFILE = "chat.log"

func WriteToLog(input []byte) error {
	file, err := os.OpenFile(LOGFILE, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	defer file.Close()
	if err != nil {
		return err
	}
	_, err = file.Write(input)
	if err != nil {
		return err
	}
	_, err = file.Write([]byte("\n"))
	if err != nil {
		return err
	}
	fmt.Println("Wrote " + string(input) + " to chat.log")
	return nil
}

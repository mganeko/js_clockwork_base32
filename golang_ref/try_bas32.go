// prepare
//    $ go get github.com/szktty/go-clockwork-base32
// run
//    $ go run try_base32.go

// https://gist.github.com/szktty/228f85794e4187882a77734c89c384a8

package main

import (
	"github.com/szktty/go-clockwork-base32"
	"fmt"
)

func main() {
	encoded := clockwork.Encode([]byte("Hello, world!"))
	decoded, err := clockwork.Decode(encoded)
	if err != nil {
		fmt.Printf("decode failed => %s\n", err)
	}
	fmt.Printf("encoded => %s\n", encoded)
	fmt.Printf("decoded => %s\n", decoded)
}

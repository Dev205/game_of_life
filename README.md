## Game Of Life Rust  
### Rules
1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.

2. Any live cell with two or three live neighbours lives on to the next generation.

3. Any live cell with more than three live neighbours dies, as if by overpopulation.

4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

Each of the Game's rules follows a straightforward translation into a condition on a `match` expression. Additionally, 
because we want JavaScript to control when ticks happen, we will put this method inside a `#[wasm_bindgen]` block, so that it gets exposed to JavaScript

## Universe
Create a fixed-size, periodic universe, where cells on the edges have neighbors that wrap around to the other 
side of the universe. Because neighbors wrap around the edges of the universe, gliders can keep running forever.
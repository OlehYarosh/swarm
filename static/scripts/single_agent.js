class GeometricConstraints {
  is_feasible(point) {
    throw new Error("Method 'is_feasible' must be implemented");
  }
}
  
class Rectangle extends GeometricConstraints {
  constructor(left_bottom_corner, right_upper_corner) {
    super();
    this.left_bottom_corner = left_bottom_corner;
    this.right_bottom_corner = [right_upper_corner[0], left_bottom_corner[1]];
    this.right_upper_corner = right_upper_corner;
    this.left_upper_corner = [left_bottom_corner[0], right_upper_corner[1]];
    this.x_range = [left_bottom_corner[0], right_upper_corner[0]];
    this.y_range = [left_bottom_corner[1], right_upper_corner[1]];
    this.height = right_upper_corner[1] - left_bottom_corner[1];
    this.width = right_upper_corner[0] - left_bottom_corner[0];
  }
  
  is_point_inside(point) {
    const [x1, y1] = this.left_bottom_corner;
    const [x2, y2] = this.right_bottom_corner;
    const [x3, y3] = this.right_upper_corner;
    const [x4, y4] = this.left_upper_corner;
    const [px, py] = point;
    const is_inside_x_range =
      Math.min(x1, x2, x3, x4) <= px && px <= Math.max(x1, x2, x3, x4);
    const is_inside_y_range =
      Math.min(y1, y2, y3, y4) <= py && py <= Math.max(y1, y2, y3, y4);
    return is_inside_x_range && is_inside_y_range;
  }
  
  is_feasible(point) {
    if (this.is_point_inside(point)) {
      return false;
    }
    return true;
  }
  
  toString() {
    return `Rectangle(left_bottom_corner=[${this.left_bottom_corner}], right_bottom_corner=[${this.right_bottom_corner}], right_upper_corner=[${this.right_upper_corner}], left_upper_corner=[${this.left_upper_corner}])`;
  }
}

function do_rectangles_overlap(rect1, rect2) {
  if (
    rect1.left_bottom_corner[0] > rect2.right_upper_corner[0] ||
    rect1.right_upper_corner[0] < rect2.left_bottom_corner[0] ||
    rect1.right_upper_corner[1] < rect2.left_bottom_corner[1] ||
    rect1.left_bottom_corner[1] > rect2.right_upper_corner[1]
  ) {
    return false;
  } else {
    return true;
  }
}

function generate_non_overlapping_rectangles(num_rectangles, min_size, max_size, x_range, y_range) {
  const rectangles = [];
  for (let i = 0; i < num_rectangles; i++) {
    const width = Math.random() * (max_size - min_size) + min_size;
    const height = Math.random() * (max_size - min_size) + min_size;

    while (true) {
      const x = Math.random() * (x_range[1] - x_range[0] - width) + x_range[0];
      const y = Math.random() * (y_range[1] - y_range[0] - height) + y_range[0];

      const new_rect = new Rectangle(
        [x, y],
        [x + width, y + height]
      );

      let overlap = false;
      for (const existing_rect of rectangles) {
        if (do_rectangles_overlap(new_rect, existing_rect)) {
          overlap = true;
          break;
        }
      }
      if (!overlap) {
        rectangles.push(new_rect);
        break;
      }
    }
  }
  return rectangles.reverse();
}

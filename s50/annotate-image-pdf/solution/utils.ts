﻿//# server typescript program utils for schedule * * * * * first run at 2100-01-01 00:00

interface Point {
  x, y: number;
}

interface Rect extends Point {
  width, height: number;
}

export function annotatorToImageCoordinates(image, points: Point[]): Point[] {
  return points.map(p => ({
    x: image.Width * p.x,
    y: image.Height * p.y
  }));
}

export function boundingRect(points: Point[]): Rect {
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function addPadding(rect: Rect, desiredWidth: number, desiredHeight: number): Rect {
  rect = { ...rect };

  const xPadding = (desiredWidth - rect.width) / 2;
  rect.x = Math.max(rect.x - xPadding, 0);
  rect.width += 2 * xPadding;

  const yPadding = (desiredHeight - rect.height) / 2;
  rect.y = Math.max(rect.y - yPadding, 0);
  rect.height += 2 * yPadding;

  return rect;
}

export function drawAnnotation(image, pctPoints, style): void {
  const isPoint = style.shape == "point";
  const pxPoints = annotatorToImageCoordinates(image, pctPoints);
  const boundingRectPx = boundingRect(pxPoints);
  if (!isPoint) {
    image.DrawPolygon(pxPoints, style);
  } else {
    const dot = addPadding(boundingRectPx, style.dotSize, style.dotSize);
    image.FillEllipse(style.color, dot.x, dot.y, dot.width, dot.height);
  }
}
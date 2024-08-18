import * as d3 from "d3";

export class MapUtil {
  ctx: CanvasRenderingContext2D;
  geojson: d3.ExtendedFeatureCollection;
  projection: d3.GeoProjection;
  geoGenerator: d3.GeoPath<any, d3.GeoPermissibleObjects>;
  sequentialScale = d3.scaleSequential().domain([0, 100]).interpolator(d3.interpolateRainbow);
  selection: d3.Selection<d3.BaseType, unknown, HTMLElement, any>;

  constructor(
    selector: d3.BaseType | string,
    geojson: d3.ExtendedFeatureCollection,
    projection?: d3.GeoProjection,
    geoGenerator?: d3.GeoPath<any, d3.GeoPermissibleObjects>
  ) {
    this.selection = d3
      //@ts-ignore
      .select(selector);
    this.ctx = this.initCtx();
    this.geojson = geojson;
    this.projection = projection || this.initProjection();
    this.geoGenerator = geoGenerator || this.initGeoGenerator();
  }

  initCtx() {
    return (
      this.selection
        .node()
        // @ts-ignore
        ?.getContext("2d")
    );
  }

  initProjection() {
    return d3.geoMercator().fitExtent(
      [
        [0, 0],
        [800, 800],
      ],
      this.geojson
    ) as d3.GeoProjection;
  }

  initGeoGenerator() {
    return d3.geoPath().projection(this.projection).pointRadius(4).context(this.ctx);
  }
}

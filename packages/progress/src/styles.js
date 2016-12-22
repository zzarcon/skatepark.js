export default `
/*
Common
 */
:host {
  width: inherit;
  position: relative;
  display: block;
  contain: content;
}
.wrapper, .progress{
  height: inherit;
  width: inherit;
}
.wrapper {
  background: var(--color);
  overflow: hidden;
  position: relative;
}
.wrapper.animated::before{
  content: '';
  width: 10000%;
  height: 100%;
  position: absolute;
  background: linear-gradient(-45deg, transparent 33%, white 33%, white 66%, transparent 66%);
  background-size: 60px 30px;
  animation: shift 200s linear infinite;
}
.progress {
  background: #ddd;
  left: 0;
  position: absolute;
  top: 0;
  transition: transform 0.3s;
}
.percentage{
  position: absolute;
  font-family: Verdana;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: bold;
}

@keyframes shift {
  0%   { left: 0%; }
  100%  { left: -9900%; }
}
`;
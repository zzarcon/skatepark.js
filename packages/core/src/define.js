export default (componentName, classDefinition) => {
  if (customElements.get(componentName)) {
    console.warn(`${componentName} it's already defined, skiping redefinition`);
    return;
  }

  customElements.define(componentName, classDefinition);
}
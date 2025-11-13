import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children?: ReactNode;
    errorComponent?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render(): ReactNode {
        return this.state.hasError ? (this.props.errorComponent as ReactNode) : this.props.children;
    }
}

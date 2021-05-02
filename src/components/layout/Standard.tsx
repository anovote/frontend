import Layout, { Content, Footer, Header } from 'antd/lib/layout/layout'
import Navigation from 'components/home/Navigation'
import React, { ReactElement } from 'react'

/**
 * The standard layout used through all sites where we want the normal navigation
 * @param props children for passing in the content to the layout, wrapperClassName and contentClassName
 * are used for passing in css class names
 */
export default function StandardLayout({
    children,
    wrapperClassName,
    contentClassName,
}: {
    children: ReactElement[]
    wrapperClassName?: string
    contentClassName?: string
}): ReactElement {
    return (
        <div className={wrapperClassName ? `home ${wrapperClassName}` : 'home'}>
            <Layout>
                <Header className="standard">
                    <Navigation />
                </Header>
                <Content className={contentClassName}>{children}</Content>
                <Footer className="text-label is-flex justify-content-center">
                    © Anovote {new Date().getFullYear()}
                </Footer>
            </Layout>
        </div>
    )
}
